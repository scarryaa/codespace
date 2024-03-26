export function createFullHandle(name: string, domain: string): string {
	name = (name || '').replace(/[.]+$/, '');
	domain = (domain || '').replace(/^[.]+/, '');
	return `${name}.${domain}`;
}
