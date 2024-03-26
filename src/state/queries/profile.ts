import { useQuery, useQueryClient } from '@tanstack/react-query';
import { STALE } from '.';
import { AppBskyActorDefs } from '@atproto/api';
import { getBskyAgent } from '../session';

export const RQKEY = (did: string) => ['profile', did];
export const profileBasicQueryKey = (didOrHandle: string) => ['profileBasic', didOrHandle];

export const useProfileQuery = ({
	did,
	staleTime = STALE.SECONDS.FIFTEEN,
}: {
	did: string | undefined;
	staleTime?: number;
}) => {
	const queryClient = useQueryClient();
	return useQuery<AppBskyActorDefs.ProfileViewDetailed>({
		staleTime,
		refetchOnWindowFocus: true,
		queryKey: RQKEY(did ?? ''),
		queryFn: async () => {
			const res = await getBskyAgent().getProfile({ actor: did ?? '' });
			return res.data;
		},
		placeholderData: () => {
			if (!did) return;

			return queryClient.getQueryData<AppBskyActorDefs.ProfileViewBasic>(profileBasicQueryKey(did));
		},
		enabled: !!did,
	});
};
