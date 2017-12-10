
const alreadyVoiceMember = (voiceChannel, _BOTUSERNAME, message) => {
    let isMember = false
    voiceChannel.members.forEach(member => {
        if (member.user.username === _BOTUSERNAME) {
            if (voiceChannel.guild.id === message.guild.id) {
                isMember =  true
            }
        }
    })
    return isMember
}

module.exports = {
    alreadyVoiceMember: alreadyVoiceMember
}
