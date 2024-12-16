import { Input } from "@/components/ui/input";
import Submit from "@/components/chat/submit";

interface ChatInputProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatInput({
  handleSubmit,
  inputValue,
  handleInputChange,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mt-5">
      <Input
        className="absolute px-5 py-5 border border-border rounded-full shadow-md placeholder-gray-400 placeholder:italic"
        placeholder="message AI Tree"
        autoComplete="off"
        name="message"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Submit disabled={!inputValue.trim()} />
    </form>
  );
}
