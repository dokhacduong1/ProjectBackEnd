const SettingsGeneral = require("../../Models/settings-general.model")

module.exports.settingGeneral = async (req,res,next)=>{
    const settingGeneral = await SettingsGeneral.findOne({});
    res.locals.settingGeneral = settingGeneral
    next()
}
