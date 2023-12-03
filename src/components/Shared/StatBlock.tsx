interface IStabBlock {
  value: string | number;
  label: string;
}

const StatBlock: React.FC<IStabBlock> = ({ value, label }) => (
  <div className='flex-center gap-2'>
    <p className='small-semibold lg:body-bold text-primary'>{value}</p>
    <p className='small-medium lg:base-medium text-dark-2 dark:text-light-2'>{label}</p>
  </div>
);

export default StatBlock;
