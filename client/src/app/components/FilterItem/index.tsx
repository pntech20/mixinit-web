import { TracksFilter } from 'app/apis/track/type';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useTags } from 'app/hooks/tags/useTags';
import FilterSelect from '../FilterSelect';

interface FilterItemProps {
  filterItems?: any;
  onFilter: (event, key, type) => void;
  onReset?: () => void;
  filter?: TracksFilter;
  setFilter?: any;
  isShowPageTrack?: boolean;
  handleFilterBpmOrYear?: any;
  range?: any;
}

const FilterItem = ({
  filterItems = [],
  onFilter,
  onReset,
  filter,
  setFilter,
  isShowPageTrack = false,
  handleFilterBpmOrYear,
  range,
}: FilterItemProps) => {
  const { genres } = useGenres();
  const { tags } = useTags();
  const { contributors: users } = useCommunity();

  return (
    <FilterSelect
      onFilter={onFilter}
      handleFilterBpmOrYear={handleFilterBpmOrYear}
      range={range}
      filter={filter}
      setFilter={setFilter}
      filterItems={filterItems}
      genres={genres}
      tags={tags}
      users={users}
      onReset={onReset}
      isShowPageTrack={isShowPageTrack}
    />
  );
};

export default FilterItem;
