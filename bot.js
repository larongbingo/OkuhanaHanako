//region Libraries and Modules
const Discord = require("discord.js");
var ArrowGenerator = require("./Modules/DanbooruImageRandomizer/ArrowPoolDeckGenerator");
const PixivApi = require("pixiv-api-client");
const DanbooruImageRandomizer = require("./Modules/DanbooruImageRandomizer/main");
const MusicPlayer = require("./Modules/Music/main");
const GlobalVariables = require("./GlobalVariables/GlobalVariables");
const ErrorReporter = require("./Modules/ExceptionHandling/ErrorReporter");
const nHentai = require("./Modules/nHentaiDetailViewer/main");
const serverQueueList = new Map();
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
//endRegion

//region attributes
const client = new Discord.Client();
const BotExceptionLogChannel = "684382771069845598";   // ID to our  bot exception log channel 
const prefix = "!";
const maintenance = false;
const pixiv = new PixivApi();
var HanakoArrows = null;
var YTPlayer = null;
var nHentaiDoujinViewer = null;
//endregion



//region bot function area
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setDefaultActivity();
    Decks = [
        ArrowGenerator.createBernabeDeck(),
        ArrowGenerator.createMarkDeck(),
        ArrowGenerator.createIvanDeck()
    ]
    HanakoArrows = new DanbooruImageRandomizer.HanakoArrows(client, Decks);
    nHentaiDoujinViewer = new nHentai.nHentaiViewer();
    /* pixiv basic search 
    const word = "クレセント(アズールレーン)";
    var returnobj = pixiv.login("user_tupx2577", process.env.PixivPassword).then(() => {
        return pixiv.searchIllust(word).then(json => {
            console.log(json);
            return pixiv.requestUrl(json.next_url);
        }).then(json => {
            console.log(json); //next results
        });
    });
    console.log(returnobj)
    */
})
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.on("disconnect", () => {
    console.log("Disconnect!");
});

client.on("message", async msg => {
    try {
        if (!msg.content.startsWith(prefix) || msg.author.bot) {
            return;
        }
        else if (msg.author.id != parseInt(GlobalVariables.DiscordIDs.BernabeDiscordID) && maintenance) {
            msg.reply("Sumimasen, Im currently on training with my master");
        }
        const args = msg.content.slice(prefix.length).split(/ +/)
        const command = args.shift().toLowerCase();
        switch (command) {
            case "killmark":
                if (validateAllowedShootingChannel(msg)) {
                    await HanakoArrows.KillMark(msg);
                }
                break;
            case "killmaster":
                if (validateAllowedShootingChannel(msg)) {
                    await HanakoArrows.KillBernabe(msg);
                }
                break;
            case "killivan":
                if (validateAllowedShootingChannel(msg)) {
                    await HanakoArrows.KillIvan(msg);
                }
                break;
            case "omakaseshot":
                if (validateAllowedShootingChannel(msg)) {
                    await HanakoArrows.ShootSomeoneRandomly(msg)
                }
                break;
            case "play":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.start(msg);
                break;
            case "skip":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.skip(msg);
                break;
            case "stop":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.stop(msg);
                break;
            case "pause":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.pauseSong(msg);
                break;
            case "resume":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.resume(msg);
                break;
            case "launchnuke":
                await nHentaiDoujinViewer.displayDoujinInfo(msg)
                break;
            case "togglerepeat":
                YTPlayer = getYTPlayerInstance(msg.guild.id);
                YTPlayer.setRepeat(msg);
                break;
            default:
                msg.reply("Ano.. sumimasen, I did not catch your command. Is there something you like to request?");
                break;
        }
    } catch (exception) {
        ErrorReporter.ReportErrorToDev(client, GlobalVariables.DiscordIDs.BernabeDiscordID, BotExceptionLogChannel, exception);
    }

})

//region validations
function validateAllowedShootingChannel(msg) {
    if (msg.channel.id != 677361288246198292 && msg.channel.id != 677361065327067136) {
        msg.reply("Ano.. sumimasen, I cant shoot someone from this channel please go to <#677361288246198292>. Thank you. ");
        return false;
    }
    return true;
}
//endregion

//region function area 
function getYTPlayerInstance(id){
    if(!serverQueueList.get(id)){
        serverQueueList.set(id, new MusicPlayer.YTMusicPlayer());
    }
    return serverQueueList.get(id);
}
//endregion
//region bot activity
function setDefaultActivity() {
    setActivity("with Okuhana Aiko", "PLAYING");
}

function setActivity(display, activity_type) {
    client.user.setActivity(display, { type: activity_type });
}
//endregion

client.login(process.env.token);
//endregion 


