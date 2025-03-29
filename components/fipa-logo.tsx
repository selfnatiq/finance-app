import { DollarSign } from 'lucide-react'

export default function FipaLogo({ className }: { className?: string }) {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div className="bg-primary rounded-sm p-1.5 text-primary-foreground">
				<DollarSign className="h-5 w-5" />
			</div>
			<div className="hidden lg:block">
				<span className="font-bold text-xl tracking-tight">Fipa</span>
				<span className="text-muted-foreground text-xs font-medium mx-1">by Natilix</span>
			</div>
		</div>
	)
}
