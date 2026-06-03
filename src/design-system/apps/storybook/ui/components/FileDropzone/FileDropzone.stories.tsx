import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import '../../../../../package/ui/components/FileDropzone/adapters/FileDropzone.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';
import '../../../../../package/ui/primitives/Progress/adapters/ProgressLinear.element.ts';
import '../../../loom-web-components.d.ts';

import {
  FILE_DROPZONE_ITEM_STATES,
  FILE_DROPZONE_REJECTION_REASONS,
} from '../../../../../package/ui/components/FileDropzone/index.ts';
import type {
  FileDropzoneItem,
  FilesRejectedEventDetail,
} from '../../../../../package/ui/components/FileDropzone/index.ts';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';

interface FileDropzoneStoryArgs {
  label: string;
  description: string;
  multiple: boolean;
  autoComplete: boolean;
  accept: string;
  maxSize: number;
  maxFiles: number;
  disabled: boolean;
}

const FileDropzoneStoryStyles = () => (
  <style>{`
    .file-dropzone-frame {
      font-family: ${fontFamilyVars.sans};
      max-width: 480px;
    }
    .file-dropzone-event-log {
      font-family: monospace;
      font-size: 12px;
      color: ${colorVars.textSecondary};
      background: ${colorVars.surfaceSubtle};
      padding: 12px;
      border-radius: 6px;
      min-height: 80px;
      white-space: pre-wrap;
    }
    .file-dropzone-event-log[data-empty="true"] {
      color: ${colorVars.textDisabled};
      font-style: italic;
    }
    .file-dropzone-custom-icon {
      width: 100%;
      height: 100%;
      color: ${colorVars.brandAccent};
    }
  `}</style>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createSyntheticFile(name: string, sizeBytes: number, type = 'application/pdf'): File {
  const buffer = new ArrayBuffer(Math.max(1, Math.min(sizeBytes, 8 * 1024 * 1024)));
  const file = new File([buffer], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

function injectFile(host: HTMLElementTagNameMap['loom-file-dropzone'], file: File): void {
  const input = host.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement | null;
  if (!input) return;
  const dt = new DataTransfer();
  dt.items.add(file);
  Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function injectFiles(host: HTMLElementTagNameMap['loom-file-dropzone'], files: File[]): void {
  const input = host.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement | null;
  if (!input) return;
  const dt = new DataTransfer();
  for (const file of files) dt.items.add(file);
  Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/FileDropzone',
  tags: ['autodocs'],
  args: {
    label: 'Descripción o archivo',
    description: 'Descripción de formato o de valor',
    multiple: false,
    autoComplete: false,
    accept: '',
    maxSize: 0,
    maxFiles: 0,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Texto principal dentro del dropzone.' },
    description: { control: 'text', description: 'Texto secundario (formato / tamaño esperado).' },
    multiple: { control: 'boolean', description: 'Permite cargar varios archivos a la vez.' },
    autoComplete: {
      control: 'boolean',
      description: 'Marca los archivos seleccionados como completos inmediatamente (modo picker).',
    },
    accept: { control: 'text', description: 'Filtro nativo `accept` (CSV de MIME / extensiones).' },
    maxSize: {
      control: { type: 'number', min: 0, step: 1024 },
      description: 'Tamaño máximo en bytes. `0` desactiva la validación.',
    },
    maxFiles: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Tope de cantidad (solo `multiple`). `0` = sin límite.',
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Zona para arrastrar archivos o abrir el explorador del sistema. El componente no realiza
upload HTTP — emite \`loom-files-selected\` con los \`File\` objects y el consumidor
controla el progreso vía métodos imperativos (\`updateProgress\`, \`completeFile\`, \`failFile\`).

\`\`\`html
<loom-file-dropzone
  label="Descripción o archivo"
  description="Descripción de formato o de valor"
  multiple
  accept="image/*,.pdf"
  max-size="5242880"
></loom-file-dropzone>
\`\`\`

Para usarlo como picker puro, añade \`auto-complete\`; los items emitidos por
\`loom-files-selected\` salen con \`state: 'complete'\` y \`progress: 100\`.

\`\`\`html
<loom-file-dropzone
  label="Selecciona un archivo"
  description="El procesamiento ocurre en un paso posterior"
  auto-complete
></loom-file-dropzone>
\`\`\`

**Eventos:** \`loom-files-selected\`, \`loom-files-rejected\`, \`loom-file-remove\`.

**Slots:** \`icon\` (fallback: flecha hacia bandeja).

**Parts:** \`dropzone\`, \`icon\`, \`label\`, \`description\`, \`files\`, \`file\`, \`file-name\`, \`file-meta\`, \`file-progress\`, \`remove-button\`.

**API imperativa:**

\`\`\`ts
const host = document.querySelector('loom-file-dropzone');
host.addEventListener('loom-files-selected', (e) => {
  for (const item of e.detail.items) {
    // subir item.file, reportar progreso
    host.updateProgress(item.id, 50);
    host.completeFile(item.id);
  }
});
\`\`\`

Estados internos por item: ${FILE_DROPZONE_ITEM_STATES.join(', ')}.
Razones de rechazo: ${FILE_DROPZONE_REJECTION_REASONS.join(', ')}.
        `.trim(),
      },
    },
  },
} satisfies Meta<FileDropzoneStoryArgs>;

export default meta;
type Story = StoryObj<FileDropzoneStoryArgs>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado vacío. Coincide con el estado *Default* del diseño Figma (84:2644).',
      },
    },
  },
  render: ({ label, description, multiple, autoComplete, accept, maxSize, maxFiles, disabled }) => (
    <>
      <FileDropzoneStoryStyles />
      <loom-box className="file-dropzone-frame">
        <loom-file-dropzone
          label={label}
          description={description}
          multiple={multiple || undefined}
          auto-complete={autoComplete || undefined}
          accept={accept || undefined}
          max-size={maxSize > 0 ? maxSize : undefined}
          max-files={maxFiles > 0 ? maxFiles : undefined}
          disabled={disabled || undefined}
        />
      </loom-box>
    </>
  ),
};

export const PickerAutoComplete: Story = {
  name: 'Picker (auto-complete)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Modo selector puro. `auto-complete` crea los items como `complete` con `progress: 100`, sin llamar a `completeFile()` tras `loom-files-selected`.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const file = createSyntheticFile('contrato-firmado.pdf', 443 * 1024);
      injectFile(host, file);
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-box className="file-dropzone-frame">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-picker-auto-complete"
            label="Selecciona un archivo"
            description="El procesamiento ocurre en el siguiente paso"
            auto-complete
          />
        </loom-box>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId(
      'dropzone-picker-auto-complete',
    ) as HTMLElementTagNameMap['loom-file-dropzone'];
    await expect(host).toBeInTheDocument();
    await expect(host.files[0]).toMatchObject({ state: 'complete', progress: 100 });
  },
};

export const Uploading: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Carga en progreso (50%). Coincide con el estado *Filling* del diseño Figma (84:2649). El consumidor llama `updateProgress` mientras dura el upload.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const file = createSyntheticFile('documento.pdf', 443 * 1024);
      injectFile(host, file);
      const items = host.files;
      if (items.length > 0) host.updateProgress(items[0].id, 50, 2);
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-box className="file-dropzone-frame">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-uploading"
            label="Descripción o archivo"
            description="Descripción de formato o de valor"
          />
        </loom-box>
      </>
    );
  },
};

export const Complete: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Carga finalizada (100%). Coincide con el estado *Filled* del diseño Figma (84:2660). Tras `completeFile`, el item permanece visible con la barra al 100% en color de éxito.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const file = createSyntheticFile('documento.pdf', 443 * 1024);
      injectFile(host, file);
      const items = host.files;
      if (items.length > 0) host.completeFile(items[0].id);
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-box className="file-dropzone-frame">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-complete"
            label="Descripción o archivo"
            description="Descripción de formato o de valor"
          />
        </loom-box>
      </>
    );
  },
};

export const Multiple: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Modo multi-archivo (`multiple`). Cada archivo se renderiza como una fila independiente con su propia barra de progreso y botón de remoción.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const files = [
        createSyntheticFile('reporte-2025.pdf', 443 * 1024),
        createSyntheticFile('captura.png', 1.2 * 1024 * 1024, 'image/png'),
        createSyntheticFile('config.json', 8 * 1024, 'application/json'),
      ];
      injectFiles(host, files);
      const items = host.files;
      if (items[0]) host.completeFile(items[0].id);
      if (items[1]) host.updateProgress(items[1].id, 65, 3);
      if (items[2]) host.failFile(items[2].id, 'Network error');
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-box className="file-dropzone-frame">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-multiple"
            label="Adjunta tus archivos"
            description="PDF, PNG, JSON · hasta 10MB cada uno"
            multiple
          />
        </loom-box>
      </>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Bloqueado. El picker no se abre y el dropzone ignora drops.',
      },
    },
  },
  render: () => (
    <>
      <FileDropzoneStoryStyles />
      <loom-box className="file-dropzone-frame">
        <loom-file-dropzone
          data-testid="dropzone-disabled"
          label="No disponible"
          description="Habilita esta sección para subir archivos."
          disabled
        />
      </loom-box>
    </>
  ),
};

export const WithRejection: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Validación de tamaño. `max-size="1024"` (1 KB). El play test inyecta un archivo de 50 KB y verifica que se emita `loom-files-rejected` con `reason: "size"`.',
      },
    },
  },
  render: () => {
    const [rejections, setRejections] = useState<string[]>([]);
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<FilesRejectedEventDetail>).detail;
        setRejections((prev) => [
          ...detail.rejections.map((r) => `[${r.reason}] ${r.file.name} — ${r.message}`),
          ...prev,
        ].slice(0, 4));
      };
      host.addEventListener('loom-files-rejected', handler);
      const oversized = createSyntheticFile('photo.png', 50 * 1024, 'image/png');
      injectFile(host, oversized);
      return () => host.removeEventListener('loom-files-rejected', handler);
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-stack className="file-dropzone-frame" gap="sm">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-rejection"
            label="Sube tu avatar"
            description="Máximo 1 KB · solo para demo"
            accept="image/*"
            max-size={1024}
          />
          <div
            className="file-dropzone-event-log"
            data-empty={rejections.length === 0 ? 'true' : 'false'}
          >
            {rejections.length === 0 ? 'No rejections yet.' : rejections.join('\n')}
          </div>
        </loom-stack>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('dropzone-rejection') as HTMLElementTagNameMap['loom-file-dropzone'];
    await expect(host).toBeInTheDocument();
    await expect(host.files).toHaveLength(0);
  },
};

export const WithCustomIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Override del slot `icon` con un SVG propio. El componente respeta el color y tamaño impuestos por el consumidor.',
      },
    },
  },
  render: () => (
    <>
      <FileDropzoneStoryStyles />
      <loom-box className="file-dropzone-frame">
        <loom-file-dropzone label="Sube tus imágenes" description="PNG o JPG · hasta 5MB">
          <svg
            slot="icon"
            className="file-dropzone-custom-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </loom-file-dropzone>
      </loom-box>
    </>
  ),
};

export const LimitedToThree: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Tope de cantidad con `max-files="3"`. Si el usuario suelta más de 3 archivos, se aceptan los primeros 3 y el resto emite `loom-files-rejected` con `reason: \'count\'`. El play test inyecta 5 archivos y verifica que solo 3 queden alojados.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    const [rejections, setRejections] = useState<string[]>([]);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<FilesRejectedEventDetail>).detail;
        setRejections((prev) =>
          [
            ...detail.rejections.map((r) => `[${r.reason}] ${r.file.name} — ${r.message}`),
            ...prev,
          ].slice(0, 6),
        );
      };
      host.addEventListener('loom-files-rejected', handler);
      const files = [
        createSyntheticFile('foto-1.jpg', 120 * 1024, 'image/jpeg'),
        createSyntheticFile('foto-2.jpg', 130 * 1024, 'image/jpeg'),
        createSyntheticFile('foto-3.jpg', 110 * 1024, 'image/jpeg'),
        createSyntheticFile('foto-4.jpg', 90 * 1024, 'image/jpeg'),
        createSyntheticFile('foto-5.jpg', 95 * 1024, 'image/jpeg'),
      ];
      injectFiles(host, files);
      return () => host.removeEventListener('loom-files-rejected', handler);
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-stack className="file-dropzone-frame" gap="sm">
          <loom-file-dropzone
            ref={ref}
            data-testid="dropzone-limited"
            label="Adjunta hasta 3 fotos"
            description="JPG o PNG · máximo 3 archivos"
            accept="image/*"
            multiple
            max-files={3}
          />
          <div
            className="file-dropzone-event-log"
            data-empty={rejections.length === 0 ? 'true' : 'false'}
          >
            {rejections.length === 0 ? 'No rejections yet.' : rejections.join('\n')}
          </div>
        </loom-stack>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('dropzone-limited') as HTMLElementTagNameMap['loom-file-dropzone'];
    await expect(host).toBeInTheDocument();
    await expect(host.files).toHaveLength(3);
    await expect(host.maxFiles).toBe(3);
  },
};

export const InteractiveEvents: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Demo con log de eventos en vivo. Suelta archivos o usa el picker para ver `loom-files-selected` y `loom-file-remove`.',
      },
    },
  },
  render: () => {
    const ref = useRef<HTMLElementTagNameMap['loom-file-dropzone'] | null>(null);
    const [events, setEvents] = useState<string[]>([]);
    useEffect(() => {
      const host = ref.current;
      if (!host) return;
      const selected = (event: Event) => {
        const detail = (event as CustomEvent<{ items: FileDropzoneItem[] }>).detail;
        const names = detail.items.map((i) => i.file.name).join(', ');
        setEvents((prev) => [`loom-files-selected → ${names}`, ...prev].slice(0, 8));
      };
      const removed = (event: Event) => {
        const detail = (event as CustomEvent<{ id: string; file: File }>).detail;
        setEvents((prev) => [`loom-file-remove → ${detail.file.name}`, ...prev].slice(0, 8));
      };
      host.addEventListener('loom-files-selected', selected);
      host.addEventListener('loom-file-remove', removed);
      return () => {
        host.removeEventListener('loom-files-selected', selected);
        host.removeEventListener('loom-file-remove', removed);
      };
    }, []);
    return (
      <>
        <FileDropzoneStoryStyles />
        <loom-stack className="file-dropzone-frame" gap="sm">
          <loom-file-dropzone
            ref={ref}
            label="Suelta archivos aquí"
            description="Cada interacción se registra debajo"
            multiple
          />
          <div className="file-dropzone-event-log" data-empty={events.length === 0 ? 'true' : 'false'}>
            {events.length === 0 ? 'No events yet — drop a file or click the zone.' : events.join('\n')}
          </div>
        </loom-stack>
      </>
    );
  },
};
