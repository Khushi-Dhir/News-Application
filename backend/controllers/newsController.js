const getNews = ( req,res ) => {
    res.status(200).json({message:"get news"})
}
const setNews = ( req,res ) => {
    res.status(200).json({message:"Set news"})
}

const putNews = ( req,res ) => {
    res.status(200).json({message:`update news at ${req.params.id}`})
}

const deleteNews = ( req,res ) => {
    res.status(200).json({message:`delete news at ${req.params.id}`})
}

module.exports = { 
    getNews ,
    setNews ,
    putNews ,
    deleteNews  
}