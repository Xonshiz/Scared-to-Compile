const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const componentsSchema = new Schema({
    id: { type:String, required:true, unique:true, index:true, default:mongoose.Types.ObjectId },
    name:String,
    icon:String,
    shouldRender:Boolean,
    itemType:Number,
    editable:Boolean,
    position:{
        x:Number,
        y:Number,
        z:Number,
        scale:Number,
        zoom:Number
    },
    width:Number,
    height:Number,
    left:Number,
    top:Number,
    data: String,
    isImageOnly: Boolean,
    imageSource: String,
})



module.exports = mongoose.model('component',componentsSchema);