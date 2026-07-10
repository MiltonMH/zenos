import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PinCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PinCodeInput({ value, onChange }: PinCodeInputProps) {
  return (
    <div className="flex justify-center">
      <InputOTP maxLength={4} inputMode="numeric" value={value} onChange={onChange}>
        <InputOTPGroup className="gap-2">
          <InputOTPSlot index={0} className="h-16 w-14 text-2xl rounded-2xl border-2" />
          <InputOTPSlot index={1} className="h-16 w-14 text-2xl rounded-2xl border-2" />
          <InputOTPSlot index={2} className="h-16 w-14 text-2xl rounded-2xl border-2" />
          <InputOTPSlot index={3} className="h-16 w-14 text-2xl rounded-2xl border-2" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
