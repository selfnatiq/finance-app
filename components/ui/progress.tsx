'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
		indicatorClassName?: string
		label?: string
	}
>(({ className, value, indicatorClassName, label = 'Progress', ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
		{...props}
		aria-label={label}
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={value || 0}
	>
		<ProgressPrimitive.Indicator
			className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorClassName)}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
