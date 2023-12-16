import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import { IDataComboBox } from '@/types';

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

const ComboBox = ({
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
}: IComboBox) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? '');

  useEffect(() => {
    onSelect(data.find((item) => item.value === value)?.label ?? '');
  }, [value, data]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='outline'
          aria-expanded={open}
          className={cn('flex w-72 justify-between', buttonClassName)}>
          <p className='truncate'>{value ? data.find((item) => item.value === value)?.label : placeholder}</p>
          {icon ? icon : <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0 w-72' side={side} align={align}>
        <Command className={commandClassName}>
          <CommandList className='overflow-auto custom-scrollbar'>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ComboBox;
