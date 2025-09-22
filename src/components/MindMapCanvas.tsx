import { useEffect, useRef } from 'react';
import type {
  CatalogCategory,
  LanguageCode,
  Palette,
  ServiceEntry,
  ServiceGroup,
  ServiceResourceEntry,
} from '../types/catalog';
import { COPY } from '../lib/copy';
import { buildCompositeKey, findResourceEntry, isGroup, makeServiceKey } from '../lib/catalog';
import { getFallbackLogo, getServiceLogoUrl } from '../lib/logo';

interface MindMapCanvasProps {
  categories: CatalogCategory[];
  language: LanguageCode;
  searchQuery: string;
  expandedCategory: number | null;
  expandedGroups: Map<string, Set<string>>;
  palette: Palette;
  selectedServiceKey: string | null;
  resources: Map<string, ServiceResourceEntry> | null;
  onToggleCategory: (index: number) => void;
  onToggleGroup: (categoryIndex: number, groupName: string) => void;
  onSelectService: (params: {
    service: ServiceEntry;
    category: CatalogCategory;
    group?: ServiceGroup | null;
    occurrence: number;
  }) => void;
}

interface NodeSizeCacheEntry {
  width: number;
  height: number;
}

type NodeSizeCache = Map<string, Map<string, NodeSizeCacheEntry>>;

interface SearchMetaItem {
  type: 'group' | 'item';
  entry: ServiceGroup | ServiceEntry;
  hasMatch?: boolean;
  groupNameMatch?: boolean;
  highlight?: boolean;
  items: { entry: ServiceEntry; match: boolean }[];
}

interface SearchMeta {
  hasMatch: boolean;
  branchInfos: SearchMetaItem[];
}

const XLINK_NS = 'http://www.w3.org/1999/xlink';

export function MindMapCanvas({
  categories,
  language,
  searchQuery,
  expandedCategory,
  expandedGroups,
  palette,
  selectedServiceKey,
  resources,
  onToggleCategory,
  onToggleGroup,
  onSelectService,
}: MindMapCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodeCacheRef = useRef<NodeSizeCache>(new Map());

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    renderMindMap({
      svg,
      categories,
      language,
      searchQuery,
      expandedCategory,
      expandedGroups,
      palette,
      selectedServiceKey,
      resources,
      onToggleCategory,
      onToggleGroup,
      onSelectService,
      nodeSizeCache: nodeCacheRef.current,
    });
  }, [
    categories,
    language,
    searchQuery,
    expandedCategory,
    expandedGroups,
    palette,
    selectedServiceKey,
    resources,
    onToggleCategory,
    onToggleGroup,
    onSelectService,
  ]);

  return <svg ref={svgRef} role="presentation" aria-hidden="true" />;
}

interface RenderOptions extends MindMapCanvasProps {
  svg: SVGSVGElement;
  nodeSizeCache: NodeSizeCache;
}

function renderMindMap({
  svg,
  categories,
  language,
  searchQuery,
  expandedCategory,
  expandedGroups,
  palette,
  selectedServiceKey,
  resources,
  onToggleCategory,
  onToggleGroup,
  onSelectService,
  nodeSizeCache,
}: RenderOptions) {
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);

  const connectorsLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const groupsLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const leafLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  svg.appendChild(connectorsLayer);
  svg.appendChild(groupsLayer);
  svg.appendChild(leafLayer);

  const CATEGORY_GAP = 260;
  const ITEM_GAP = 320;
  const GROUP_GAP = 200;
  const BASE_SPACING = 120;
  const ITEM_SPACING = 72;
  const MARGIN_Y = 140;
  const CANVAS_WIDTH = 1240;
  const MIN_HEIGHT = 720;

  const query = searchQuery.trim().toLowerCase();
  const searchActive = query.length > 0;
  const searchMeta = searchActive ? categories.map((cat) => createSearchMeta(cat, query)) : [];

  const visibleIndices: number[] = [];
  categories.forEach((cat, idx) => {
    if (!searchActive) {
      visibleIndices.push(idx);
      return;
    }
    if (searchMeta[idx] && searchMeta[idx]?.hasMatch) {
      visibleIndices.push(idx);
    }
  });

  if (searchActive && visibleIndices.length === 0) {
    const height = MIN_HEIGHT;
    svg.setAttribute('viewBox', `0 0 ${CANVAS_WIDTH} ${height}`);
    svg.setAttribute('height', `${height}`);
    const message = createEllipseNode(groupsLayer, nodeSizeCache, CANVAS_WIDTH / 2, height / 2, COPY.noResults[language], {
      fill: palette.surface,
      stroke: palette.surfaceBorder,
      strokeWidth: 1.6,
      className: 'normal',
    });
    message.text.setAttribute('fill', palette.nodeText);
    return;
  }

  const rightCount = Math.ceil(visibleIndices.length / 2);
  const leftCount = visibleIndices.length - rightCount;

  const weights = visibleIndices.map((idx) => {
    if (searchActive) {
      const meta = searchMeta[idx];
      if (!meta) return 1.6;
      let visibleCount = 0;
      meta.branchInfos.forEach((branch) => {
        if (branch.type === 'group') {
          if (branch.groupNameMatch) {
            visibleCount += 1 + branch.items.length;
          } else {
            visibleCount += branch.items.filter((info) => info.match).length;
          }
        } else if (branch.highlight) {
          visibleCount += 1;
        }
      });
      return Math.max(1.6, visibleCount ? visibleCount * 0.9 : 1.4);
    }
    if (expandedCategory === idx) {
      const leafCount = countLeafItems(categories[idx].items, expandedGroups.get(`${idx}`));
      return Math.max(1.6, leafCount * 0.9);
    }
    return 1;
  });

  const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);
  const rightWeight = sum(weights.slice(0, rightCount));
  const leftWeight = sum(weights.slice(rightCount));
  const span = (weight: number, count: number) => (weight > 0 ? weight : Math.max(count, 1));

  const height = Math.max(
    MIN_HEIGHT,
    MARGIN_Y * 2 + span(rightWeight, rightCount) * BASE_SPACING,
    MARGIN_Y * 2 + span(leftWeight, leftCount) * BASE_SPACING,
  );

  const availableHeight = height - MARGIN_Y * 2;
  svg.setAttribute('viewBox', `0 0 ${CANVAS_WIDTH} ${height}`);
  svg.setAttribute('height', `${height}`);

  const rootX = CANVAS_WIDTH / 2;
  const rootY = height / 2;

  const positions = new Map<number, { x: number; y: number; side: 'left' | 'right' }>();

  const layoutSide = (subset: number[], subsetWeights: number[], side: 'left' | 'right') => {
    if (!subset.length) return;
    const totalWeight = subsetWeights.reduce((acc, val) => acc + val, 0) || subset.length;
    let cursor = MARGIN_Y;
    subset.forEach((idx, order) => {
      const weight = subsetWeights[order] || totalWeight / subset.length;
      const portion = weight / totalWeight;
      const segment = portion * availableHeight;
      const centerY = cursor + segment / 2;
      positions.set(idx, {
        x: side === 'right' ? rootX + CATEGORY_GAP : rootX - CATEGORY_GAP,
        y: centerY,
        side,
      });
      cursor += segment;
    });
  };

  layoutSide(visibleIndices.slice(0, rightCount), weights.slice(0, rightCount), 'right');
  layoutSide(visibleIndices.slice(rightCount), weights.slice(rightCount), 'left');

  const rootNode = createEllipseNode(groupsLayer, nodeSizeCache, rootX, rootY, 'AI Compass', {
    fill: palette.surface,
    stroke: palette.nodeText,
    strokeWidth: 2,
    paddingX: 38,
    paddingY: 26,
    className: 'large',
  });
  rootNode.text.setAttribute('fill', palette.nodeText);

  const serviceOccurrences = new Map<string, number>();

  visibleIndices.forEach((idx) => {
    const pos = positions.get(idx);
    if (!pos) return;
    const category = categories[idx];
    const catNode = createEllipseNode(groupsLayer, nodeSizeCache, pos.x, pos.y, category.category, {
      fill: category.color,
      fillOpacity: 0.12,
      stroke: category.color,
      strokeWidth: 2,
      paddingX: 28,
      paddingY: 20,
      className: 'normal',
    });

    const startX = pos.side === 'right' ? rootX + rootNode.rx : rootX - rootNode.rx;
    const endX = pos.side === 'right' ? catNode.x - catNode.rx : catNode.x + catNode.rx;
    const ctrlX = startX + (endX - startX) * 0.6;

    connectorsLayer.appendChild(
      createPath(`M ${startX} ${rootY} C ${ctrlX} ${rootY}, ${ctrlX} ${catNode.y}, ${endX} ${catNode.y}`, {
        stroke: category.color,
        strokeWidth: 1.8,
        strokeOpacity: 0.75,
      }),
    );

    catNode.group.style.cursor = 'pointer';
    catNode.group.setAttribute('role', 'button');
    catNode.group.setAttribute('tabindex', '0');
    catNode.group.addEventListener('click', () => onToggleCategory(idx));
    catNode.group.addEventListener('keypress', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        onToggleCategory(idx);
      }
    });

    const groupState = expandedGroups.get(`${idx}`) || new Set<string>();
    const branchInfos = searchActive ? searchMeta[idx]?.branchInfos : null;

    const leafStartX = pos.side === 'right' ? pos.x + ITEM_GAP : pos.x - ITEM_GAP;

    let slotCursor = 0;

    const categoryOpened = searchActive || expandedCategory === idx;
    if (!categoryOpened) {
      return;
    }

    const entries = category.items;
    entries.forEach((entry, entryIndex) => {
      if (isGroup(entry)) {
        const branchInfo = branchInfos ? branchInfos[entryIndex] : undefined;
        const hasMatch = branchInfo ? branchInfo.hasMatch : false;
        const groupExpanded = searchActive ? !!hasMatch : groupState.has(entry.group);
        const groupSlots = groupExpanded ? entry.items.length + 1 : 1;
        const totalHeight = (groupSlots - 1) * ITEM_SPACING;
        const groupY = pos.y - (ITEM_SPACING * (groupSlots - 1)) / 2 + slotCursor * ITEM_SPACING;
        const groupNode = createEllipseNode(groupsLayer, nodeSizeCache, pos.side === 'right' ? pos.x + GROUP_GAP : pos.x - GROUP_GAP, groupY, entry.group, {
          fill: palette.surface,
          stroke: category.color,
          strokeWidth: 1.6,
          paddingX: 24,
          paddingY: 16,
          className: 'normal',
        });

        const startBranchX = pos.side === 'right' ? catNode.x + catNode.rx : catNode.x - catNode.rx;
        const endBranchX = pos.side === 'right' ? groupNode.x - groupNode.rx : groupNode.x + groupNode.rx;
        const ctrlBranchX = startBranchX + (endBranchX - startBranchX) * 0.6;

        connectorsLayer.appendChild(
          createPath(`M ${startBranchX} ${catNode.y} C ${ctrlBranchX} ${catNode.y}, ${ctrlBranchX} ${groupNode.y}, ${endBranchX} ${groupNode.y}`, {
            stroke: category.color,
            strokeWidth: 1.6,
            strokeOpacity: 0.6,
          }),
        );

        groupNode.group.style.cursor = 'pointer';
        groupNode.group.setAttribute('role', 'button');
        groupNode.group.setAttribute('tabindex', '0');
        groupNode.group.addEventListener('click', () => onToggleGroup(idx, entry.group));
        groupNode.group.addEventListener('keypress', (evt) => {
          if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            onToggleGroup(idx, entry.group);
          }
        });

        if (searchActive && branchInfo?.groupNameMatch) {
          groupNode.group.classList.add('search-hit');
        }

        if (groupExpanded) {
          entry.items.forEach((svc, svcIdx) => {
            const occurrence = incrementOccurrence(serviceOccurrences, svc);
            const serviceKey = buildCompositeKey(makeServiceKey(svc), occurrence);
            const itemY = groupNode.y - totalHeight / 2 + (svcIdx + 1) * ITEM_SPACING;
            const itemX = leafStartX;
            const resourceEntry = resources ? findResourceEntry(resources, svc) : undefined;
            const node = createServiceNode({
              parent: leafLayer,
              defs,
              cache: nodeSizeCache,
              x: itemX,
              y: itemY,
              service: svc,
              category,
              serviceKey,
              selected: selectedServiceKey === serviceKey,
              palette,
            });
            attachServiceHandlers({
              node,
              category,
              service: svc,
              group: entry,
              occurrence,
              onSelectService,
              serviceKey,
            });
            if (resourceEntry?.tags?.length) {
              node.group.setAttribute('data-tags', resourceEntry.tags.join(','));
            }
            const itemMatch = branchInfo?.items ? branchInfo.items[svcIdx]?.match : false;
            if (searchActive && itemMatch) {
              node.group.classList.add('search-hit');
            }
            connectorsLayer.appendChild(
              createPath(`M ${pos.side === 'right' ? groupNode.x + groupNode.rx : groupNode.x - groupNode.rx} ${groupNode.y} C ${itemX - (pos.side === 'right' ? node.rx : -node.rx) * 0.4} ${groupNode.y}, ${itemX - (pos.side === 'right' ? node.rx : -node.rx) * 0.4} ${itemY}, ${pos.side === 'right' ? itemX - node.rx : itemX + node.rx} ${itemY}`, {
                stroke: category.color,
                strokeWidth: 1.4,
                strokeOpacity: 0.5,
              }),
            );
          });
        }
        slotCursor += groupSlots;
      } else {
        const occurrence = incrementOccurrence(serviceOccurrences, entry);
        const serviceKey = buildCompositeKey(makeServiceKey(entry), occurrence);
        const itemY = pos.y - ((entries.length - 1) * ITEM_SPACING) / 2 + slotCursor * ITEM_SPACING;
        const itemX = leafStartX;
        const resourceEntry = resources ? findResourceEntry(resources, entry) : undefined;
        const node = createServiceNode({
          parent: leafLayer,
          defs,
          cache: nodeSizeCache,
          x: itemX,
          y: itemY,
          service: entry,
          category,
          serviceKey,
          selected: selectedServiceKey === serviceKey,
          palette,
        });
        attachServiceHandlers({
          node,
          category,
          service: entry,
          occurrence,
          onSelectService,
          serviceKey,
        });
        if (resourceEntry?.tags?.length) {
          node.group.setAttribute('data-tags', resourceEntry.tags.join(','));
        }
        const branchInfo = branchInfos ? branchInfos[entryIndex] : undefined;
        if (searchActive && branchInfo?.highlight) {
          node.group.classList.add('search-hit');
        }
        connectorsLayer.appendChild(
          createPath(`M ${pos.side === 'right' ? catNode.x + catNode.rx : catNode.x - catNode.rx} ${catNode.y} C ${itemX - (pos.side === 'right' ? node.rx : -node.rx) * 0.4} ${catNode.y}, ${itemX - (pos.side === 'right' ? node.rx : -node.rx) * 0.4} ${itemY}, ${pos.side === 'right' ? itemX - node.rx : itemX + node.rx} ${itemY}`, {
            stroke: category.color,
            strokeWidth: 1.4,
            strokeOpacity: 0.55,
          }),
        );
        slotCursor += 1;
      }
    });
  });
}

function createPath(d: string, opts: { stroke: string; strokeWidth: number; strokeOpacity?: number }) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', opts.stroke);
  path.setAttribute('stroke-width', String(opts.strokeWidth));
  if (opts.strokeOpacity != null) {
    path.setAttribute('stroke-opacity', String(opts.strokeOpacity));
  }
  return path;
}

function createEllipseNode(
  parent: SVGGElement,
  cache: NodeSizeCache,
  x: number,
  y: number,
  label: string,
  options: {
    fill: string;
    fillOpacity?: number;
    stroke: string;
    strokeWidth: number;
    className: string;
    paddingX?: number;
    paddingY?: number;
  },
) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', `translate(${x},${y})`);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('class', options.className);
  text.textContent = label;
  group.appendChild(text);

  const padX = options.paddingX ?? 18;
  const padY = options.paddingY ?? 12;
  let width: number;
  let height: number;
  const cached = cache.get(label)?.get(options.className);
  if (cached) {
    width = cached.width;
    height = cached.height;
  } else {
    const bbox = text.getBBox();
    width = bbox.width;
    height = bbox.height;
    let entry = cache.get(label);
    if (!entry) {
      entry = new Map();
      cache.set(label, entry);
    }
    entry.set(options.className, { width, height });
  }

  const rx = width / 2 + padX;
  const ry = height / 2 + padY;

  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', '0');
  ellipse.setAttribute('cy', '0');
  ellipse.setAttribute('rx', `${rx}`);
  ellipse.setAttribute('ry', `${ry}`);
  ellipse.setAttribute('fill', options.fill);
  if (options.fillOpacity != null) {
    ellipse.setAttribute('fill-opacity', String(options.fillOpacity));
  }
  ellipse.setAttribute('stroke', options.stroke);
  ellipse.setAttribute('stroke-width', String(options.strokeWidth));

  group.insertBefore(ellipse, text);
  parent.appendChild(group);

  return { group, text, ellipse, x, y, rx, ry };
}

function incrementOccurrence(map: Map<string, number>, service: ServiceEntry) {
  const id = makeServiceKey(service);
  const current = map.get(id) || 0;
  map.set(id, current + 1);
  return current;
}

function attachServiceHandlers({
  node,
  category,
  service,
  group,
  occurrence,
  onSelectService,
  serviceKey,
}: {
  node: ReturnType<typeof createServiceNode>;
  category: CatalogCategory;
  service: ServiceEntry;
  group?: ServiceGroup;
  occurrence: number;
  onSelectService: MindMapCanvasProps['onSelectService'];
  serviceKey: string;
}) {
  const toggleHover = (state: boolean) => {
    if (state) {
      node.group.classList.add('service-hover');
    } else {
      node.group.classList.remove('service-hover');
    }
  };
  node.group.dataset.serviceKey = serviceKey;
  node.group.classList.add('service-node');
  node.group.setAttribute('role', 'button');
  node.group.setAttribute('tabindex', '0');
  node.group.addEventListener('mouseenter', () => toggleHover(true));
  node.group.addEventListener('mouseleave', () => toggleHover(false));
  node.group.addEventListener('focus', () => toggleHover(true));
  node.group.addEventListener('blur', () => toggleHover(false));
  const handleSelect = () =>
    onSelectService({
      service,
      category,
      group: group || null,
      occurrence,
    });
  node.group.addEventListener('click', (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    handleSelect();
  });
  node.group.addEventListener('keypress', (evt) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      handleSelect();
    }
  });
}

function createServiceNode({
  parent,
  defs,
  cache,
  x,
  y,
  service,
  category,
  serviceKey,
  selected,
  palette,
}: {
  parent: SVGGElement;
  defs: SVGDefsElement;
  cache: NodeSizeCache;
  x: number;
  y: number;
  service: ServiceEntry;
  category: CatalogCategory;
  serviceKey: string;
  selected: boolean;
  palette: Palette;
}) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', `translate(${x},${y})`);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('text-anchor', 'start');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('class', 'small');
  text.textContent = service.name;
  group.appendChild(text);

  const padX = 26;
  const padY = 16;
  const iconSize = 32;
  const gap = 12;

  const bbox = text.getBBox();
  const contentWidth = iconSize + gap + bbox.width;
  const contentHeight = Math.max(iconSize, bbox.height);
  const rx = contentWidth / 2 + padX;
  const ry = contentHeight / 2 + padY;

  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', '0');
  ellipse.setAttribute('cy', '0');
  ellipse.setAttribute('rx', `${rx}`);
  ellipse.setAttribute('ry', `${ry}`);
  ellipse.setAttribute('fill', palette.surface);
  ellipse.setAttribute('stroke', category.color);
  ellipse.setAttribute('stroke-width', '1.6');

  group.insertBefore(ellipse, text);

  const iconCenterX = -contentWidth / 2 + iconSize / 2;
  const clipId = `clip-${serviceKey}`;
  let clip = defs.querySelector(`#${clipId}`) as SVGClipPathElement | null;
  if (!clip) {
    clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clip.setAttribute('id', clipId);
    const clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCircle.setAttribute('cx', `${iconCenterX}`);
    clipCircle.setAttribute('cy', '0');
    clipCircle.setAttribute('r', `${iconSize / 2}`);
    clip.appendChild(clipCircle);
    defs.appendChild(clip);
  }

  const iconBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  iconBg.setAttribute('cx', `${iconCenterX}`);
  iconBg.setAttribute('cy', '0');
  iconBg.setAttribute('r', `${iconSize / 2 + 2}`);
  iconBg.setAttribute('fill', 'rgba(15, 23, 42, 0.65)');
  group.insertBefore(iconBg, text);

  const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  img.setAttribute('width', `${iconSize}`);
  img.setAttribute('height', `${iconSize}`);
  img.setAttribute('x', `${-contentWidth / 2}`);
  img.setAttribute('y', `${-iconSize / 2}`);
  img.setAttributeNS(XLINK_NS, 'href', getServiceLogoUrl(service.href));
  img.setAttribute('clip-path', `url(#${clipId})`);
  img.addEventListener('error', () => {
    img.setAttributeNS(XLINK_NS, 'href', getFallbackLogo());
  });
  group.insertBefore(img, text);

  text.setAttribute('x', `${-contentWidth / 2 + iconSize + gap}`);
  text.setAttribute('y', '0');

  if (selected) {
    group.classList.add('selected');
  }

  parent.appendChild(group);

  return { group, text, ellipse, x, y, rx, ry };
}

function countLeafItems(entries: (ServiceEntry | ServiceGroup)[], groupState?: Set<string>) {
  return entries.reduce((total, entry) => {
    if (isGroup(entry)) {
      if (groupState && groupState.has(entry.group)) {
        return total + 1 + entry.items.length;
      }
      return total + 1;
    }
    return total + 1;
  }, 0);
}

function createSearchMeta(category: CatalogCategory, query: string): SearchMeta {
  const items = category.items;
  const branchInfos: SearchMetaItem[] = [];
  let hasMatch = false;
  items.forEach((entry) => {
    if (isGroup(entry)) {
      const groupMatches = entry.group.toLowerCase().includes(query);
      const list = entry.items.map((svc) => ({
        entry: svc,
        match: svc.name.toLowerCase().includes(query) || svc.desc.toLowerCase().includes(query),
      }));
      const anyMatch = groupMatches || list.some((info) => info.match);
      branchInfos.push({ type: 'group', entry, hasMatch: anyMatch, groupNameMatch: groupMatches, items: list });
      if (anyMatch) {
        hasMatch = true;
      }
    } else {
      const match = entry.name.toLowerCase().includes(query) || entry.desc.toLowerCase().includes(query);
      branchInfos.push({ type: 'item', entry, highlight: match, items: [] });
      if (match) {
        hasMatch = true;
      }
    }
  });
  return { hasMatch, branchInfos };
}
