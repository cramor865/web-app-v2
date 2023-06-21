export type RadioGroupProps = {
  name: string;
  value: string;
  list: { label: string; value: string; icon?: React.ReactNode }[];
  onChange: (value: string) => void;
  label?: string;
  containerClassName?: string;
  className?: string;
};
