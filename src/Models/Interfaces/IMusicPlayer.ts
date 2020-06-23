import { IMusicPlaylist } from "./IMusicPlaylist";
import { MusicPlayItem } from "./MusicPlayItem";

export interface IMusicPlayer{
    _now_playing : IMusicPlaylist | undefined;
    _repeat : boolean;
    _player_status : number;
    _override_action : string;
    addToQueue(song : MusicPlayItem) : boolean;
    playSong() : boolean;
    skipSong() : boolean;
    stopPlayer() : boolean;
    pauseSong() : boolean;
    resumePlayer() : boolean;
    previous() : boolean;
    toggleRepeat() : boolean;
}