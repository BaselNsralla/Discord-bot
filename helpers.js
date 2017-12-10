

const alreadyVoiceMember = (voiceChannel, _BOTUSERNAME) => {
    if (voiceChannel) {
        //if he has a voice channel
    }
    let isMember = false
    voiceChannel.members.forEach(member => {
        if (member.user.username === _BOTUSERNAME) {
            return true
        }
    })
    return isMember
}

module.exports = {
    alreadyVoiceMember: alreadyVoiceMember
}
