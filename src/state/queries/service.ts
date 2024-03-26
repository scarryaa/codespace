import { BskyAgent } from '@atproto/api';
import { useQuery } from '@tanstack/react-query';

export const RQKEY = (serviceUrl: string) => ['service', serviceUrl];

export const useServiceQuery = (serviceUrl: string) => {
	return useQuery({
		queryKey: RQKEY(serviceUrl),
		queryFn: async () => {
			const agent = new BskyAgent({ service: serviceUrl });
			const res = await agent.com.atproto.server.describeServer();
			return res.data;
		},
		enabled: isValidUrl(serviceUrl),
	});
};

const isValidUrl = (url: string) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const urlp = new URL(url);
		return true;
	} catch {
		return false;
	}
};
