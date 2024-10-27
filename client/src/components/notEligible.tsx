import { IconNotificationOff } from "@tabler/icons-react";

interface NotEligibleProps {
  title: string;
  description: string;
}

export default function NotEligible({ title, description }: NotEligibleProps) {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <IconNotificationOff size={72} />
        <h1 className="text-4xl font-bold leading-tight">{title}</h1>
        <p className="text-center text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
