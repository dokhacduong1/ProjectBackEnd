module.exports.cacheControl = async(req,res,next)=>{
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    next();
}