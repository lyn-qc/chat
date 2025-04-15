import Quill, { Delta, Op, type QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { PiTextAa } from 'react-icons/pi';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { MdSend } from 'react-icons/md';
import { Hint } from './hint';
import type { RefObject } from 'react';
import { cn } from '@/lib/utils';
import EmojiPopover from './emoji-popover';
import Image from 'next/image';
type EditorValue = {
  image: File | null;
  body: string;
}
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: React.RefObject<Quill | null>;
}
const Editor = ({
  onSubmit,
  onCancel,
  placeholder,
  defaultValue = [],
  disabled = false,
  innerRef
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit)
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const [text, setText] = useState('')
  const [image,setImage] = useState<File | null>(null)
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  })
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editor = container.appendChild(container.ownerDocument.createElement('div'));
    const options: QuillOptions = {
      theme: 'snow',
      modules: {
        toolbar: false,  // 明确禁用工具栏
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !addedImage;
                if (isEmpty) {
                  return ;
                }
                const body = JSON.stringify(quill.getContents());
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              }
            }
          }
        }
      }
    }
    const quill = new Quill(editor, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if (innerRef) {
      innerRef.current = quill;
    }
    quill.setContents(defaultValueRef.current);
    setText(quill.getText())
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quill) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null;
      }
    }
  }, [innerRef])
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    // 强制保持编辑器焦点
    quill?.focus();
    const selectionIndex = quill?.getSelection()?.index || 0;
    quill?.insertText(selectionIndex, emoji.emoji);

    // 恢复焦点到原位置+插入长度
    setTimeout(() => {
      quill?.setSelection(selectionIndex + emoji.emoji.length, 0);
    }, 0);
  }
  return (
    <div className="flex flex-col">
      <input
       type="file"
       accept='image/*'
       ref={imageElementRef}
       onChange={(e) => {
         setImage(e.target.files?.[0]||null)
       }}
       className='hidden'
      >
      </input>
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white" >
        <div
          ref={containerRef}
          className='h-full ql-custom'
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
        {
          !!image && (
            <div className='p-2'>
              <div className='relative size-[62px] flex items-center justify-center group/image'>
                <Button
                 onClick={()=>{
                  setImage(null)
                  imageElementRef.current!.value = ''
                 }}
                 className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 z-[4] text-white size-6 border-2 border-white items-center justify-center'
                >
                  <XIcon className='size-3.5'></XIcon>
                </Button>
                <Image src={URL.createObjectURL(image)}
                  alt="Uploaded image"
                 fill
                 className='rounded-xl overflow-hidden border object-cover'
                ></Image>
              </div>
            </div>
          )
        }
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label='格式化'>
            <Button
              disabled={false}
              size="sm"
              variant="outline"
              className='border-0'
              onClick={() => {
                // handle click
              }
              }
            >
              <PiTextAa className='size-4'></PiTextAa>
            </Button>
          </Hint>
          <EmojiPopover hint='emoji' onEmojiSelect={onEmojiSelect}>
            <Button
              disabled={false}
              size="sm"
              variant="outline"
              className='border-0'
              onClick={() => {
                // handle click
              }
              }
            >
              <Smile className='size-4'></Smile>
            </Button>
          </EmojiPopover>
          <Hint label='图片'>
            <Button
              disabled={false}
              size="sm"
              variant="outline"
              className='border-0'
              onClick={() => {
                imageElementRef.current?.click()
              }
              }
            >
              <ImageIcon className='size-4'></ImageIcon>
            </Button>
          </Hint>
          <Button
            disabled={disabled || isEmpty}
            size="sm"
            className={cn(
              'ml-auto',
              isEmpty ?
                "bg-white hover:bg-white text-muted-foreground" :
                "bg-[rgb(0,147,245)] hover:bg-[rgb(0,147,245)]/80 "
            )
          }
          onClick={()=>{
            onSubmit({
              body:JSON.stringify(quillRef.current?.getContents()),
              image
            })
          }}
          >
            <MdSend className='size-4'></MdSend>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Editor;