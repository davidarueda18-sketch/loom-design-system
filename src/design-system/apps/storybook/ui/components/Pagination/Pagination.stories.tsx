import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import {
  Pagination,
} from '../../../../../package/ui/components/Pagination/index.ts';
import type {
  PaginationChangeEventDetail,
  PaginationSizeChangeEventDetail,
} from '../../../../../package/ui/components/Pagination/index.ts';

import '../../../../../package/ui/components/Pagination/adapters/Pagination.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

interface PaginationStoryArgs {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: string;
  siblings: number;
  disabled: boolean;
}

function getLoomPagination(canvasElement: HTMLElement): HTMLElementTagNameMap['loom-pagination'] {
  const host = canvasElement.querySelector('loom-pagination');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected a loom-pagination host in the canvas.');
  }
  return host as HTMLElementTagNameMap['loom-pagination'];
}

function PaginationEventLog() {
  const [logs, setLogs] = useState<string[]>([]);
  const hostRef = useRef<HTMLElementTagNameMap['loom-pagination'] | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onPageChange = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeEventDetail>).detail;
      setLogs((prev) => [
        `loom-pagination-change -> page=${detail.page}, pageSize=${detail.pageSize}`,
        ...prev,
      ].slice(0, 8));
    };

    const onSizeChange = (event: Event) => {
      const detail = (event as CustomEvent<PaginationSizeChangeEventDetail>).detail;
      setLogs((prev) => [
        `loom-pagination-size-change -> pageSize=${detail.pageSize}`,
        ...prev,
      ].slice(0, 8));
    };

    host.addEventListener('loom-pagination-change', onPageChange as EventListener);
    host.addEventListener('loom-pagination-size-change', onSizeChange as EventListener);

    return () => {
      host.removeEventListener('loom-pagination-change', onPageChange as EventListener);
      host.removeEventListener('loom-pagination-size-change', onSizeChange as EventListener);
    };
  }, []);

  return (
    <loom-stack gap="smMd">
      <loom-pagination
        ref={hostRef}
        page={1}
        page-size={10}
        total-items={96}
        page-size-options="10,25,50"
      >
        <p slot="summary" className="loom-body-sm" style={{ margin: 0 }}>
          1-10 of 96 items
        </p>
      </loom-pagination>

      <loom-box
        display="block"
        padding="smMd"
        style={{
          minHeight: '80px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          color: colorVars.textSecondary,
        }}
      >
        {logs.length === 0
          ? <p className="loom-caption" style={{ margin: 0, opacity: 0.6 }}>No events yet: use prev/next, page buttons, or page-size select.</p>
          : logs.map((entry, idx) => <p key={idx} className="loom-caption" style={{ margin: 0 }}>{entry}</p>)}
      </loom-box>
    </loom-stack>
  );
}

const meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  args: {
    page: 1,
    pageSize: 10,
    totalItems: 96,
    pageSizeOptions: '10,25,50',
    siblings: 1,
    disabled: false,
  },
  argTypes: {
    page: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Current page (1-based).',
    },
    pageSize: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Items per page.',
    },
    totalItems: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Total number of records.',
    },
    pageSizeOptions: {
      control: 'text',
      description: 'Comma-separated page size options, for example "10,25,50".',
    },
    siblings: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Visible page siblings around the current page.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all controls.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Pagination navigation rendered as the canonical custom element \`loom-pagination\`.

\`\`\`html
<loom-pagination
  page="1"
  page-size="10"
  total-items="96"
  page-size-options="10,25,50"
  siblings="1"
>
  <p slot="summary" class="loom-body-sm">1-10 of 96 items</p>
</loom-pagination>
\`\`\`

## Public surface

| Type | Name | Description |
| --- | --- | --- |
| Attribute | \`page\` | Current page (1-based). |
| Attribute | \`page-size\` | Number of items per page. |
| Attribute | \`total-items\` | Total records count. |
| Attribute | \`page-size-options\` | Comma-separated options for the selector. |
| Attribute | \`siblings\` | Number of sibling pages around current page. |
| Attribute | \`disabled\` | Blocks all interactions. |
| Slot | \`summary\` | Optional summary content shown on the left. |
| Event | \`loom-pagination-change\` | Emits \`{ page, pageSize }\` when page changes. |
| Event | \`loom-pagination-size-change\` | Emits \`{ pageSize }\` when size changes. |
| CSS Part | \`nav\` | Root navigation wrapper. |
| CSS Part | \`summary\` | Summary slot wrapper. |
| CSS Part | \`size-select\` | Page-size select wrapper. |
| CSS Part | \`prev\` | Previous button host. |
| CSS Part | \`next\` | Next button host. |
        `.trim(),
      },
    },
  },
} satisfies Meta<PaginationStoryArgs>;

export default meta;
type Story = StoryObj<PaginationStoryArgs>;

export const Default: Story = {
  render: ({ page, pageSize, totalItems, pageSizeOptions, siblings, disabled }) => (
    <loom-box display="block" padding="lg">
      <loom-pagination
        page={page}
        page-size={pageSize}
        total-items={totalItems}
        page-size-options={pageSizeOptions || undefined}
        siblings={siblings}
        disabled={disabled || undefined}
      >
        <p slot="summary" className="loom-body-sm" style={{ margin: 0 }}>
          {`Page ${page} of ${Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)))}`}
        </p>
      </loom-pagination>
    </loom-box>
  ),
};

export const WebComponent: Story = {
  name: 'Web Component (loom-pagination)',
  parameters: {
    docs: {
      description: {
        story: 'Canonical custom-element usage with slot summary and page-size selector.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-pagination page={1} page-size={10} total-items={96} page-size-options="10,25,50" siblings={1}>
        <p slot="summary" className="loom-body-sm" style={{ margin: 0 }}>
          1-10 of 96 items
        </p>
      </loom-pagination>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomPagination(canvasElement);
    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.shadowRoot?.querySelector('[part="nav"]')).toBeTruthy();
    await expect(host.shadowRoot?.querySelector('loom-fab[part="next"]')).toBeTruthy();

    const events: PaginationChangeEventDetail[] = [];
    host.addEventListener('loom-pagination-change', (event) => {
      events.push((event as CustomEvent<PaginationChangeEventDetail>).detail);
    }, { once: true });

    const next = host.shadowRoot?.querySelector('loom-fab[part="next"]') as HTMLElement | null;
    next?.click();

    await waitFor(async () => {
      await expect(host.getAttribute('page')).toBe('2');
      await expect(events.length).toBe(1);
      await expect(events[0]?.page).toBe(2);
    });
  },
};

export const CustomEvents: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Use native listeners to react to page and page-size changes.

\`\`\`ts
const host = document.querySelector('loom-pagination');
host?.addEventListener('loom-pagination-change', (event) => {
  const { page, pageSize } = (event as CustomEvent<{ page: number; pageSize: number }>).detail;
});

host?.addEventListener('loom-pagination-size-change', (event) => {
  const { pageSize } = (event as CustomEvent<{ pageSize: number }>).detail;
});
\`\`\`
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <PaginationEventLog />
    </loom-box>
  ),
};

export const CSSParts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
External customization via \`::part()\`.

\`\`\`css
loom-pagination::part(nav) {
  border-radius: 14px;
}

loom-pagination::part(summary) {
  color: var(--loom-color-text-primary);
}
\`\`\`
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <style>
        {`
          .pagination-parts-demo loom-pagination::part(nav) {
            border-radius: 14px;
            border-color: ${colorVars.brandAccent};
          }

          .pagination-parts-demo loom-pagination::part(summary) {
            color: ${colorVars.textPrimary};
          }

          .pagination-parts-demo loom-pagination::part(size-select) {
            background: ${colorVars.surfaceBase};
            padding: 2px 6px;
            border-radius: 8px;
          }
        `}
      </style>
      <loom-box display="block" className="pagination-parts-demo">
        <loom-pagination page={3} page-size={10} total-items={96} page-size-options="10,25,50" siblings={1}>
          <p slot="summary" className="loom-body-sm" style={{ margin: 0 }}>
            21-30 of 96 items
          </p>
        </loom-pagination>
      </loom-box>
    </loom-box>
  ),
};

export const ReactWrapper: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Framework integration example. The React wrapper renders `loom-pagination` and maps custom events to callbacks.',
      },
    },
  },
  render: () => {
    const [state, setState] = useState({ page: 1, pageSize: 10 });

    return (
      <loom-box display="block" padding="lg">
        <loom-stack gap="smMd">
          <Pagination
            page={state.page}
            pageSize={state.pageSize}
            totalItems={128}
            pageSizeOptions="10,25,50"
            onChange={(detail) => setState((prev) => ({ ...prev, page: detail.page }))}
            onSizeChange={(detail) => setState({ page: 1, pageSize: detail.pageSize })}
          >
            <p slot="summary" className="loom-body-sm" style={{ margin: 0 }}>
              {`Page ${state.page} · size ${state.pageSize}`}
            </p>
          </Pagination>
          <p className="loom-caption" style={{ margin: 0, color: colorVars.textSecondary }}>
            Controlled state: page={state.page}, pageSize={state.pageSize}
          </p>
        </loom-stack>
      </loom-box>
    );
  },
};
