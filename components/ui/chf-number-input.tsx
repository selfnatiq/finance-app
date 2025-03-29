import { Input } from '@/components/ui/input'
import { ChfIcon } from '@/components/ui/chf-icon'

interface ChfNumberInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	value: number | ''
	onChange: (value: number) => void
	placeholder?: string
	className?: string
}

export function ChfNumberInput({
	value,
	onChange,
	placeholder,
	className = '',
	...props
}: ChfNumberInputProps) {
	return (
		<div className="relative">
			<ChfIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
			<Input
				type="number"
				placeholder={placeholder || 'Enter amount in CHF'}
				value={value || ''}
				onChange={(e) => onChange(Number(e.target.value))}
				className={`pl-8 number-input ${className}`}
				{...props}
			/>
		</div>
	)
}
