import {
  LegacyStack,
  Tag,
  Listbox,
  Combobox,
  Icon,
  TextContainer,
} from '@shopify/polaris';

import {SearchIcon} from '@shopify/polaris-icons';

import {useState, useCallback, useMemo, useEffect} from 'react';

export default function SelectProducts(value) {
  const deselectedOptions = useMemo(
    () => value,
    [],
  );

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  useEffect(() => {
    const savedSelected = localStorage.getItem('products');

    setSelectedOptions(JSON.parse(savedSelected) || []);
  }, []);

  const escapeSpecialRegExCharacters = useCallback(
    (handle) => handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = useCallback(
    (handle) => {
      setInputValue(handle);

      if (handle === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(handle), 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selected),
        );
      } else {
        setSelectedOptions([...selectedOptions, selected]);
      }

      updateText('');
      localStorage.setItem('products', JSON.stringify(selectedOptions));
    },
    [selectedOptions, updateText],
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions],
  );

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag key={`option-${option}`} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  const optionsMarkup =
    options?.value?.length > 0
      ? options?.value?.map((option) => {
        const {title, handle, url} = option;

        return (
          <Listbox.Option
            key={`${handle}`}
            value={handle}
            selected={selectedOptions.includes(handle)}
            accessibilityLabel={title}
            children={<Image source={url} alt={title}/>}
          >
            {title}
          </Listbox.Option>
        );
      })
      : null;

  return (
    <div style={{height: '225px'}}>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search products"
            labelHidden
            value={inputValue}
            placeholder="Search products"
            autoComplete="off"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
        ) : null}
      </Combobox>
      <TextContainer>
        <LegacyStack>{tagsMarkup}</LegacyStack>
      </TextContainer>
    </div>
  );
}
