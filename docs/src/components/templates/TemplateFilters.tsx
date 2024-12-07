import React, { useEffect } from 'react'
import styles from '../../pages/templates.module.css'
import { Filters } from '@site/src/data/templates'
import { useTemplateFilters } from '@site/src/hooks/useTemplateFilters'
import { TemplateFiltersItem } from './TemplateFiltersItem'
import { TemplateSearch } from './TemplateSearch'
import type { TemplateFilter } from '@site/src/data/templates'

export const TemplateFilters = () => {
	const { filter: selectedFilter, setFilter } = useTemplateFilters()

	// Apply filter and search from URL if available
	useEffect(() => {
		const url = new URL(window.location.href)
		const filter = url.searchParams.get('filter')
		const filterFound = Filters.find((f) => f.value === filter)

		if (filterFound) {
			setFilter(filterFound)
		}
	}, [])

	const onClickFilter = (filter: TemplateFilter) => {
		setFilter(filter)

		// Update URL query
		const url = new URL(window.location.href)
		if (filter.value === 'all-templates') {
			url.searchParams.delete('filter')
		} else {
			url.searchParams.set('filter', filter.value)
		}
		window.history.pushState({}, '', url.toString())
	}

	return (
		<div className={styles.filterBar}>
			<h3 className={styles.filterTitle}>Filter Templates</h3>
			<TemplateSearch />
			<div className={styles.filterOptions}>
				{Filters.map((filter) => (
					<TemplateFiltersItem
						key={filter.value}
						filter={filter}
						onClick={onClickFilter}
						selected={selectedFilter.value === filter.value}
					/>
				))}
			</div>
		</div>
	)
}
