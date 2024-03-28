import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useRef, useEffect } from "react";

interface TextAreaProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string) => void;
}

function pasteAsPlainText(event: any) {
  event.preventDefault();
  event.target.innerText = event.clipboardData.getData("text/plain");
}


const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  changeValue,
}) => {

  return (
    <div className="relative">
      <div
        contentEditable="plaintext-only"
        onInput={(e) => changeValue?.(id, e.currentTarget.innerText || "")}
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        className={`peer w-full px-4 pt-8 pb-2 min-h-[100px] rounded-md outline-none border-[1px] bg-slate-100 transition ${
          errors[id]
            ? "border-red-500 focus:border-red-500"
            : "border-zinc-500 focus:border-blue-400"
        } disabled:opacity-70 disabled:cursor-not-allowed text-xl font-sans antialiased break-words hyphens-auto`}
      />
      <label
        htmlFor={id}
        className={`absolute bg-slate-100 px-1 top-2 left-4 z-[1] ${
          errors[id] ? "text-red-500" : "text-zinc-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default TextArea;
