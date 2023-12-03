import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IDataComboBox } from '@/types';
import Loader from './Loader';

interface IComboBox {
  data: IDataComboBox[];
  buttonClassName?: string;
  commandClassName?: string;
  icon?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  defaultValue?: string;
  onSelect: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  notFound: string;
}

const ComboBox: React.FC<IComboBox> = ({
  data,
  onSelect,
  placeholder,
  searchPlaceholder,
  commandClassName,
  buttonClassName,
  notFound,
  icon,
  side = 'top',
  align = 'center',
  defaultValue
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? '');

  useEffect(() => {
    onSelect(data.find((item) => item.value === value)?.label ?? '');
  }, [value, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          aria-expanded={open}
          className={cn('w-72 justify-between', buttonClassName)}>
          <p className='truncate'>{value ? data.find((item) => item.value === value)?.label : placeholder}</p>
          {icon ? icon : <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' side={side} align={align}>
        <Command className={commandClassName}>
          <CommandList className='custom-scrollbar'>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{notFound}</CommandEmpty>
            {data.length === 0 ? (
              <Loader />
            ) : (
              data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}>
                  <Check className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
                  {item.label}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
