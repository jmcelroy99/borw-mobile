import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { mainStack } from 'src/config/navigator';

const uniqueArr = (data) => {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(item => item.id == current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}

let isFirstTime = true

const useCategoryFacade = (navigation, t) => {
  const initialFilter = [
    {
      name: t('categories:text_clothing'),
      value: 'Clothing',
      isSelected: false
    },
    {
      name: t('categories:text_accessories'),
      value: 'Accessories',
      isSelected: false
    },
    {
      name: t('categories:text_shoes'),
      value: 'Shoes',
      isSelected: false
    },
    {
      name: t('categories:text_kids'),
      value: 'Kids',
      isSelected: false
    },
    {
      name: t('categories:text_women'),
      value: 'Women',
      isSelected: false
    },
    {
      name: t('categories:text_men'),
      value: 'Men',
      isSelected: false
    }]
  const initialFilterForKids = [
    {
      name: t('categories:text_girls'),
      value: 'Girls',
      isSelected: true
    },
    {
      name: t('categories:text_boys'),
      value: 'Boys',
      isSelected: true
    },
    {
      name: t('categories:text_baby'),
      value: 'Baby',
      isSelected: true
    }]
  const filterList = [{
    name: t('categories:text_clothing'),
    iconName: 'tshirt-crew',
  }, {
    name: t('categories:text_accessories'),
    iconName: 'diamond-stone',
  }, {
    name: t('categories:text_shoes'),
    iconName: 'shoe-formal',
  }, {
    name: t('categories:text_women'),
    iconName: 'human-female',
  }, {
    name: t('categories:text_men'),
    iconName: 'human-male',
  }, {
    name: t('categories:text_kids'),
    iconName: 'human-child',
  }]

  const genderKids = [{
    name: t('categories:text_girls'),
    parent: t('categories:text_kids'),
    iconName: 'human-female-girl',
    iconType: 'material-community'
  }, {
    name: t('categories:text_boys'),
    parent: t('categories:text_kids'),
    iconName: 'human-male-boy',
    iconType: 'material-community'
  }, {
    name: t('categories:text_baby'),
    parent: t('categories:text_kids'),
    iconName: 'child-care',
    iconType: 'material'
  }]
  const [filters, setFilters] = useState(initialFilter)
  const [filtersForKids, setFiltersForKids] = useState(initialFilterForKids)
  const [filterTemp, setFilterTemp] = useState([])
  const [filterResultForKids, setFilterResultForKids] = useState([])
  const [filterResult, setFilterResult] = useState([])
  const [search, setSearch] = useState('')
  const [filterKids, setFilterKids] = useState(false)
  const { data } = useSelector(state => state.category)

  useEffect(() => {
    setFilters(initialFilter)
  }, [])

  useEffect(() => {
    if (data) {
      setFilterResultForKids(data.filter(item => item.parent == 'Kids'))
    }
  }, [data])

  const _onUpdateSearch = value => {
    isFirstTime && setFilterTemp(filterResult)
    isFirstTime = false
    let searchResult = []
    setSearch(value)
    if (value != '') {
      if (data) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].title.includes(value)) {
            searchResult.push(data[index])
          }
        }
        setFilterResult(searchResult)
      }
    } else {
      setFilterResult(filterTemp)
    }
  }

  const _onChangeFilter = (value, isSelected) => {
    if (value == t('categories:text_kids')) {
      const newFilter = [...initialFilter]
      newFilter[3].isSelected = !filters[3].isSelected
      setFilters(newFilter)
      setFilterKids(isSelected)
      setFilterResult([])
      return;
    }

    const newFilters = [...filters]
    const index = newFilters.findIndex(i => i.name == value)
    newFilters[index].isSelected = isSelected
    setFilters(newFilters)

    let newResults = [...filterResult]

    for (let index = 0; index < newFilters.length; index++) {
      if (newFilters[index].name == t('categories:text_women') || newFilters[index].name == t('categories:text_men')) {
        if (newFilters[index].isSelected) {
          if (newFilters[5].isSelected && newFilters[4].isSelected) {
            if (!newFilters[0].isSelected && !newFilters[1].isSelected && !newFilters[2].isSelected && !newFilters[3].isSelected) {
              newResults = data.filter(item => (item.gender == newFilters[5].value || item.gender == newFilters[4].value))
            } else {
              const temp = [newFilters[0], newFilters[1], newFilters[2], newFilters[3]]
              for (let index = 0; index < temp.length; index++) {
                if (temp[index].isSelected) {
                  newResults = newResults.concat(data.filter(item => item.parent == temp[index].value))
                }
              }
              break;
            }
          } else {
            if (newFilters[4].isSelected) {
              if (newResults.length > 0) {
                newResults = newResults.filter(item => item.gender == newFilters[4].value)
              } else {
                newResults = data.filter(item => item.gender == newFilters[4].value)
              }
            } else if (newFilters[5].isSelected) {
              if (newResults.length > 0) {
                newResults = newResults.filter(item => item.gender == newFilters[5].value)
              } else {
                newResults = data.filter(item => item.gender == newFilters[5].value)
              }
            } else if (newResults.length > 0) {
              const genderArr = data.filter(item => item.gender == newFilters[index].value)
              newResults = newResults.concat(genderArr)
            } else {
              newResults = data.filter(item => item.gender == newFilters[index].value)
            }
          }
        } else {
          if (!newFilters[0].isSelected && !newFilters[1].isSelected && !newFilters[2].isSelected && !newFilters[3].isSelected) {
            newResults = newResults.filter(item => item.gender != newFilters[index].value)
          }
        }
      } else {
        if (newFilters[4].isSelected || newFilters[5].isSelected) {
          if (newFilters[index].isSelected) {
            const parentArray = [newFilters[0], newFilters[1], newFilters[2], newFilters[3]]
            if (newFilters[4].isSelected && newFilters[5].isSelected) {
              for (let index = 0; index < parentArray.length; index++) {
                if (parentArray[index].isSelected) {
                  const newArr = data.filter(item => item.parent == newFilters[index].value)
                  newResults = newResults.concat(newArr)
                } else {
                  newResults = newResults.filter(item => item.parent != newFilters[index].value)
                }
              }
            } else {
              for (let index = 0; index < parentArray.length; index++) {
                if (parentArray[index].isSelected) {
                  if (newFilters[4].isSelected) {
                    const newArr = data.filter(item => (item.parent == newFilters[index].value && item.gender == t('categories:text_women')))
                    newResults = newResults.concat(newArr)
                  } else {
                    const newArr = data.filter(item => (item.parent == newFilters[index].value && item.gender == t('categories:text_men')))
                    newResults = newResults.concat(newArr)
                  }
                } else {
                  newResults = newResults.filter(item => item.parent != newFilters[index].value)
                }
              }
            }
          } else {
            newResults = newResults.filter(item => item.parent != newFilters[index].value)
          }
        } else {
          if (newFilters[index].isSelected) {
            const parentArray = [newFilters[0], newFilters[1], newFilters[2], newFilters[3]]
            for (let index = 0; index < parentArray.length; index++) {
              if (parentArray[index].isSelected) {
                const newArr = data.filter(item => item.parent == newFilters[index].value)
                newResults = newResults.concat(newArr)
              } else {
                newResults = newResults.filter(item => item.parent != newFilters[index].value)
              }
            }
          } else {
            newResults = newResults.filter(item => item.parent != newFilters[index].value)
          }
        }
      }
    }
    setFilterResult(uniqueArr(newResults))
  }

  const _onChangeFilterForKids = (value, isSelected) => {
    const newFilters = [...filtersForKids]
    const index = newFilters.findIndex(i => i.name == value)
    newFilters[index].isSelected = isSelected
    setFiltersForKids(newFilters)
    let newResults = [...filterResultForKids]

    for (let index = 0; index < newFilters.length; index++) {
      if (newFilters[index].isSelected) {
        newResults = newResults.concat(data.filter(item => (item.parent == 'Kids' && item.gender == newFilters[index].value)))
      } else {
        newResults = newResults.filter(item => (item.parent == 'Kids' && item.gender != newFilters[index].value))
      }
    }
    setFilterResultForKids(uniqueArr(newResults))
  }

  const _onSelectCategory = item => {
    navigation.navigate(mainStack.new_product, {
      category: item
    })
  }

  return {
    filters,
    filterList,
    filterResult,
    search,
    genderKids,
    filterKids,
    filtersForKids,
    filterResultForKids,
    _onChangeFilterForKids,
    _onSelectCategory,
    _onUpdateSearch,
    _onChangeFilter
  }
}

export {
  useCategoryFacade
}
