

const alreadyVoiceMember = (voiceChannel, _BOTUSERNAME) => {
    if (voiceChannel) {
        for (let m in voiceChannel.members) {
            if (m.user.username === _BOTUSERNAME) {
                return true
            }
        }
        return false
    }
}
