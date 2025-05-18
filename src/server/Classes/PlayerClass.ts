import { Profile } from '@rbxts/profile-store';
import { ProfileTemplate, ProfileTemplateTypes } from 'server/Utils/ProfileTemplate';

export class PlayerClass {
	public readonly data: typeof ProfileTemplate;
	private listeners: { name: string; listener: RBXScriptConnection }[] = [];

	constructor(
		readonly player: Player,
		private profile: Profile<ProfileTemplateTypes>
	) {
		this.profile.AddUserId(player.UserId);
		this.profile.Reconcile();
		this.data = profile.Data;

		this.listeners.push({
			name: 'session',
			listener: <RBXScriptConnection>this.profile.OnSessionEnd.Connect(() => this.onLeave()),
		});
	}

	public onLeave(): void {
		const sessionListener = this.listeners.find((listener) => listener.name === 'session');

		if (sessionListener) {
			const index = this.listeners.findIndex((listener) => listener.name === 'session');
			sessionListener.listener.Disconnect();
			this.listeners.remove(index);
		}

		if (this.profile.IsActive()) {
			this.profile.EndSession();
			this.player.Kick('Current session is closed by the server');
		}

		print(`${this.player.DisplayName} has left the game`);
	}
}
