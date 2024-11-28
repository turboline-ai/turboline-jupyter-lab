import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  ILayoutRestorer
} from '@jupyterlab/application';
import {
  Widget
} from '@lumino/widgets';
import { requestAPI } from './handler';

/**
 * Initialization data for the turboline-ai extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'turboline-ai',
  autoStart: true,
  requires: [ILayoutRestorer],
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    console.log('Turboline AI extension is activated!');

    // Create the widget
    const widget = new TurbolineAIWidget();
    app.shell.add(widget, 'left');

    // Register the widget for state restoration
    restorer.add(widget, 'turboline-ai');
  }
};

class TurbolineAIWidget extends Widget {
  constructor() {
    super({ node: document.createElement('div') });
    this.id = 'turboline-ai-widget';
    this.title.label = 'Turboline AI';
    this.title.closable = true;
    this.addClass('turboline-ai-widget');

    // Set up the UI
    this.setupUI();
  }

  setupUI() {
    this.node.innerHTML = `
      <div class="turboline-container">
        <textarea id="turboline-input" placeholder="Enter your command here..."></textarea>
        <button id="turboline-generate">Generate</button>
      </div>
    `;

    // Add event listener to the button
    this.node.querySelector('#turboline-generate')!.addEventListener('click', async () => {
      const input = (this.node.querySelector('#turboline-input') as HTMLTextAreaElement).value.trim();
      if (input) {
        this.setLoadingState(true);
        const code = await this.generateCode(input);
        this.insertCode(code);
        this.setLoadingState(false);
      }
    });
  }

  setLoadingState(isLoading: boolean) {
    const button = this.node.querySelector('#turboline-generate') as HTMLButtonElement;
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Generating...' : 'Generate';
  }

  async generateCode(prompt: string): Promise<string> {
    try {
      const response = await requestAPI<string>('generate', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      return response;
    } catch (error) {
      console.error('Error generating code:', error);
      return '// Error generating code';
    }
  }

  insertCode(code: string) {
    const notebook = (window as any).Jupyter.notebook;
    if (notebook) {
      notebook.insert_cell_below('code').set_text(code);
      notebook.select_next();
    } else {
      // For JupyterLab 3.x and later
      const app = (window as any).JupyterLab?.app;
      const notebookPanel = app?.shell.currentWidget;
      if (notebookPanel && notebookPanel.model) {
        const notebook = notebookPanel.content;
        notebook.model.cells.push({
          cell_type: 'code',
          source: code,
          metadata: {}
        });
      }
    }
  }
}

export default plugin;
