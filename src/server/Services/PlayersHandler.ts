import { Players, RunService } from '@rbxts/services';
import { PlayerClass } from '../Classes/PlayerClass';
import ProfileStore from '@rbxts/profile-store';
import { ProfileTemplate } from '../Utils/ProfileTemplate';

const STORE_KEY = 'UFS_STORE_ALPHA:170525';
const PlayersInstances = new Map<Player, PlayerClass>();

const GameStore = RunService.IsStudio()
	? ProfileStore.New(STORE_KEY, ProfileTemplate).Mock
	: ProfileStore.New(STORE_KEY, ProfileTemplate);

function onPlayerAdded(player: Player) {
	const playerProfile = GameStore.StartSessionAsync(`UFS_${player.UserId}_ALPHA:170525`);

	// ! TODO: the session is nil, the plr has entered in other server instantly or really not loaded your data for some reason
	if (!playerProfile) {
		warn(`aahhhh TODO`);
		player.Kick('aaaaaaaa');
		return;
	}

	const playerInstance = new PlayerClass(player, playerProfile);
	PlayersInstances.set(player, playerInstance);
}

function onPlayerRemoving(player: Player) {
	const leavingInstance = PlayersInstances.get(player);
	leavingInstance?.onLeave();

	if (leavingInstance) {
		PlayersInstances.delete(player);
	}
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
