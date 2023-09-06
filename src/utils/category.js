import includes from 'lodash/includes';
import filter from 'lodash/filter';

export function excludeCategory(data, ids) {
    return filter(data, (item) => !includes(ids, item.id));
}

export const getCategoryName = (id, listCategory) => {
    const category = listCategory.find(item => item.id == id)
    if (category) {
        return category.title
    } else return ''
}
