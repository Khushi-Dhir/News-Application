const asyncHandler = require('express-async-handler')
const news = require('../models/newsModel.js')

const getNews =asyncHandler( async ( req,res ) => {
    const News = await news.find()
    res.status(200).json(News)
})
const setNews =asyncHandler( async ( req,res ) => {
    if(!req.body.title){
        res.status(400)
        throw new Error('Please Add a title')
    }
    const News = await news.create({
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        source:req.body.source
    }) 
    res.status(200).json(News)
})

const putNews =asyncHandler( async ( req,res ) => {
    const News = await news.findById(req.params.id)
    if(!News) {
        res.status(400)
        throw new Error('News Not Found')
    }
    const UpdatedNews = await news.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(UpdatedNews)
})

const deleteNews =asyncHandler( async ( req,res ) => {
    const News = await news.findById(req.params.id)
    if(!News) {
        res.status(400)
        throw new Error('News Not Found')
    }
    await news.deleteOne()
    res.status( 200).json({id: req.params.id})
})

module.exports = { 
    getNews ,
    setNews ,
    putNews ,
    deleteNews  
}