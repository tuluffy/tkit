import * as React from 'react';
import Form, { FormItem, WrappedInput, IFormProps } from './Form';
import Modal from './Modal';
import './Editor.less';
import { i18n } from '@src/utils';

type Value = undefined | string;

// own props
export interface IEditorProps {
  children?: React.ReactElement<any> | undefined;
  disabled?: boolean; // false	Disabled editor or not
  value?: Value;
  onChange?: (value: Value) => any;
  getEditor?: (EditorInstance: Editor) => void;
}

// own state
export interface IEditorState {}

type Props = IEditorProps;

const defaultProps: Props = {
  disabled: false,
  value: '',
  onChange: undefined
};

export default class Editor extends React.Component<Props, IEditorState> {
  public static defaultProps = defaultProps;
  public editor: any | null;
  public canvas: any;
  public editorConfig: any = {
    readOnly: this.props.disabled,
    modules: {
      toolbar: [
        { header: [1, 2, 4, 5, false] },
        { color: [] },
        { background: [] },
        { font: ['宋体', '黑体', 'Arial', 'serif', 'sans-serif'] },
        'bold',
        'italic',
        'underline',
        'strike',
        'link',
        'image',
        'code-block'
      ]
    },
    theme: 'snow'
  };
  public formProps: IFormProps = {
    Render: () => (
      <FormItem label="链接" name="link">
        <WrappedInput />
      </FormItem>
    ),
    noformProps: {
      validateConfig: {
        link: { type: 'url' }
      }
    }
  };

  public async componentDidMount() {
    try {
      // 避免在 IE 10及以下浏览器报错
      const { default: Quill } = await import('quill');
      try {
        const Font = Quill.import('formats/font');
        // We do not add Sans Serif since it is the default
        Font.whitelist = ['宋体', '黑体', 'Arial', 'serif', 'sans-serif'];
        Quill.register(Font, true);
        this.editor = new Quill(this.canvas, this.editorConfig);
        this.setValue(this.props.value);
        const toolbar = this.editor.getModule('toolbar');
        // to do
        // toolbar.addHandler('image', () => new Promise(()));
        toolbar.addHandler('link', this.handleLink);
        this.editor.on('text-change' as any, this.onChange);
      } catch (e) {
        console.warn(e);
      }
    } catch (e) {
      Modal.error({
        title: i18n('common.error', '错误'),
        content: i18n('common.editor.ie10', '很抱歉，我们的编辑器不支持IE 10 及以下浏览器 - _ -||')
      });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      if (this.editor && prevProps.value !== this.getValue()) {
        this.setValue(this.props.value);
      }
    }
    if (prevProps.disabled !== this.props.disabled) {
      if (this.editor) {
        this.editor.enable(!this.props.disabled);
      }
    }
  }

  public componentWillUnmount() {
    if (this.editor) {
      this.editor.off('text-change' as any, this.onChange);
    }
    this.editor = null;
    this.canvas = null;
  }

  public handleLink = (select: boolean) => {
    const { editor } = this;
    if (editor) {
      const selection = editor.getSelection();
      if (selection && selection.length) {
        const { index, length } = selection;
        const formProps = {
          ...this.formProps
        };
        const restoreSelection = () => editor.setSelection(index, length, 'user');
        if (editor.getFormat(index, length)) {
          if (formProps.noformProps) {
            formProps.noformProps.value = { link: editor.getFormat(index, length).link };
          }
        }
        Form.confirm({
          formProps,
          modalProps: {
            title: '',
            onOk: ({ link }) => {
              // if empty, remove link
              editor.formatText(index, length, { link: link.trim() ? link : null }, 'user');
            }
          }
        }).then(restoreSelection, restoreSelection);
      }
    }
  };

  public onChange = (delta?: any, old?: any) => {
    if (this.props.onChange) {
      const val = this.getValue();
      this.props.onChange(val === '' ? undefined : val);
    }
  };

  public getValue() {
    if (this.editor && this.editor.root) {
      const html = this.editor.root.innerHTML;
      const SimSunHtml = html.replace(/class="ql-font-宋体"/g, 'style="font-family: SimSun"');
      const SimHeiHtml = SimSunHtml.replace(/class="ql-font-黑体"/g, 'style="font-family: SimHei"');
      const ArialHtml = SimHeiHtml.replace(/class="ql-font-Arial"/g, 'style="font-family: Arial"');
      const serifHtml = ArialHtml.replace(/class="ql-font-serif"/g, 'style="font-serif: serif"');
      const sansSerifHtml = serifHtml.replace(
        /class="ql-font-sans-serif"/g,
        'style="font-serif: sans-serif"'
      );
      return sansSerifHtml === '<p><br></p>' ? '' : sansSerifHtml;
    }
    return '';
  }

  public setValue(value: any) {
    if (this.editor) {
      if (this.editor.clipboard) {
        this.editor.clipboard.dangerouslyPasteHTML(value);
      }
      this.onChange();
    }
  }

  // unpredictable
  public insert = (
    content: string,
    linkUrl?: string,
    source: 'api' | 'user' | 'silent' = 'api',
    selection?: any
  ) => {
    if (this.editor && content) {
      const len = content.length;
      const { editor } = this;
      let index = 0;
      selection = selection || editor.getSelection();
      if (selection) {
        index = selection.index;
      } else {
        index = editor.getLength() - 1;
      }
      // 判断所处 link 环境
      let currentFormat = editor.getFormat(index, 1);
      if (currentFormat && currentFormat.link) {
        if (linkUrl) {
          // 不可插入链接
          return;
        }
      } else {
        currentFormat = editor.getFormat(index - 1, 1);
        if (currentFormat && currentFormat.link) {
          index += 1;
          this.editor.insertText(index, ' ', source);
        } else {
          currentFormat = editor.getFormat(index + 1, 1);
          if (currentFormat && currentFormat.link) {
            this.editor.insertText(index, ' ', source);
          }
        }
      }
      this.editor.insertText(index, content, source);
      if (linkUrl) {
        this.editor.formatText(index, len, { link: linkUrl }, source);
        this.editor.setSelection(index + len, 0, source);
      } else {
        this.editor.setSelection(index, len, source);
      }
    }
  };

  public render() {
    const { getEditor } = this.props;
    if (getEditor) {
      getEditor(this);
    }
    return (
      <div className="k-common-editor">
        <div
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      </div>
    );
  }
}
