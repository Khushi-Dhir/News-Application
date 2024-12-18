const asyncHandler = require('express-async-handler')
const getNews =asyncHandler( async ( req,res ) => {
    res.status(200).json({message:"get news"})
})
const setNews =asyncHandler( async ( req,res ) => {
    if(!req.body.title){
        res.status(400)
        throw new Error('Please Add a title')
    }
    console.log(req.body.title)
    res.status(200).json({message:"Set news"})
})

const putNews =asyncHandler( async ( req,res ) => {
    res.status(200).json({message:`update news at ${req.params.id}`})
})

const deleteNews =asyncHandler( async ( req,res ) => {
    res.status(200).json({message:`delete news at ${req.params.id}`})
})

module.exports = { 
    getNews ,
    setNews ,
    putNews ,
    deleteNews  
}