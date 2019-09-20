module.exports = {
  SLACK_CLIENTID: process.env.SLACK_CLIENTID || '',
  SLACK_CLIENTSECRET: process.env.SLACK_CLIENTSECRET || 'f' ,
  SLACK_REDIRECTURL: process.env.SLACK_REDIRECTURL || '',
  SLACK_SCOPE: process.env.SLACK_SCOPE || 'chat:write:bot,chat:write:user,im:history',
  SLACK_TOKEN: process.env.SLACK_TOKEN || ''
}