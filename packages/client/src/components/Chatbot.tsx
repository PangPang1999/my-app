import { useRef, type KeyboardEvent } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    reset();

    const { data } = await axios.post('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });
    console.log(data);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认提交 → 改为手动调用 handleSubmit(onSubmit)()，这样可以走自己定义的表单校验和提交逻辑，而不是浏览器的默认逻辑。
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatBot;
