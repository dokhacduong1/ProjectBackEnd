const SettingsGeneral = require("../../Models/settings-general.model")
module.exports.getGeneral = async function (req, res) {
    const settingsGeneral = await SettingsGeneral.findOne({})

    res.render("Admin/Pages/Settings/general", {
        title: "Trang Cài Đặt Chung",
        settingGeneral: settingsGeneral
    });
}
module.exports.patchGeneral = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("settings-general_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const settingsGeneral = await SettingsGeneral.findOne({})
    if (settingsGeneral) {
       
        await SettingsGeneral.updateOne({
            _id: settingsGeneral.id
        }, req.body);
    } else {
        const record = new SettingsGeneral(req.body);
        await record.save();
    }
    res.redirect("back")
}