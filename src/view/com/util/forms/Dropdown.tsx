import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ComponentProps, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Dropdown.scss';

export const DropdownMenuRoot = DropdownMenu.Root;
export const DropdownMenuContent = DropdownMenu.Content;

type ItemProps = ComponentProps<(typeof DropdownMenu)['Item']>;
export const DropdownMenuItem = (props: ItemProps & { testID?: string }) => {
	const [focused, setFocused] = useState(false);

	return (
		<DropdownMenu.Item
			className="dropdown-item"
			{...props}
			onFocus={() => {
				setFocused(true);
			}}
			onBlur={() => {
				setFocused(false);
			}}
			style={{ backgroundColor: focused ? 'var(--white)' : '' }}
		/>
	);
};

export interface DropdownItem {
	label: string;
	onPress?: () => void;
	testID?: string;
	icon?: IconProp;
}

interface Props {
	items: DropdownItem[];
	children: React.ReactNode;
	className?: string;
	testID?: string;
}

export const Dropdown = ({ items, children, className }: PropsWithChildren<Props>) => {
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const clickHandler = (e: MouseEvent) => {
			const t = e.target;

			if (!open || !buttonRef.current || !menuRef.current) return;

			if (
				t !== buttonRef.current &&
				!buttonRef.current.contains(t as Node) &&
				t !== menuRef.current &&
				!menuRef.current.contains(t as Node)
			) {
				e.preventDefault();
				e.stopPropagation();

				setOpen(false);
			}
		};

		const keydownHandler = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open) {
				setOpen(false);
			}
		};

		document.addEventListener('click', clickHandler, true);
		window.addEventListener('keydown', keydownHandler, true);

		return () => {
			document.removeEventListener('click', clickHandler, true);
			document.removeEventListener('keydown', keydownHandler, true);
		};
	}, [open, setOpen]);

	return (
		<DropdownMenuRoot
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
			}}
		>
			<DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content ref={menuRef} className={`dropdown-content ${className ?? ''}`} loop>
					{items.map((item, index) => {
						if (item.label === 'separator') {
							return (
								<DropdownMenu.Separator
									className="dropdown-separator"
									key={getKey(item.label, index, item.testID)}
								/>
							);
						}

						if (index > 1 && items[index - 1].label === 'separator') {
							return (
								<DropdownMenu.Group
									className="dropdown-group"
									key={getKey(item.label, index, item.testID)}
								>
									<DropdownMenuItem
										className="dropdown-item"
										key={getKey(item.label, index, item.testID)}
										onSelect={item.onPress}
									>
										<span>{item.label}</span>
										{item.icon && (
											<FontAwesomeIcon icon={item.icon} fontSize={14} color={'var(--white)'} />
										)}
									</DropdownMenuItem>
								</DropdownMenu.Group>
							);
						}

						return (
							<DropdownMenuItem key={getKey(item.label, index, item.testID)} onSelect={item.onPress}>
								<span>{item.label}</span>
								{item.icon && <FontAwesomeIcon icon={item.icon} fontSize={20} color={'var(--white)'} />}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenuRoot>
	);
};

const getKey = (label: string, index: number, id?: string) => {
	if (id) return id;
	return `${label}_${index.toString()}`;
};
