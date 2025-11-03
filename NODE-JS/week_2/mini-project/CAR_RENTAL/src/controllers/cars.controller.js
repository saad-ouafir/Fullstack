import {getAllCarsService,getCarByIdService,createCarService,updateCarService,deleteCarService} from '../services/car.service.js'

function getAllCarsController(req, res) {
  let {page=1,limit=10,category,available,minpricePerDay,maxpricePerDay,q,sort} = req.query
  page=parseInt(page)
  limit=parseInt(limit)

  if(isNaN(page) || page < 1){
      page=1;
  }
  if(isNaN(limit) || limit < 1){
      limit=10;
  }
  let getcars=getAllCarsService()
  const allcategory=["eco","sedan","suv","van"]
  if(category && allcategory.includes(category)){
    getcars=getcars.filter(c=>c.category===category)
  }
  if(available!==undefined){
    getcars=getcars.filter(c=>c.available===available)
  }
  const minPrice=parseFloat(minpricePerDay)
  const maxPrixe=parseFloat(maxpricePerDay)
  if(!isNaN(minPrice) && !isNaN(maxPrixe)){
    if(minPrice>maxPrixe){
      return res.status(400).json({error:"minpricePerDay doit être < à maxpricePerDay"});
    }
    getcars=getcars.filter(c=>c.pricePerDay <= maxPrixe && c.pricePerDay >= minPrice)
  }else{
    if(!isNaN(minPrice) && minPrice>0){
      getcars=getcars.filter(c=>c.pricePerDay >= minPrice)
    }
    if(!isNaN(maxpricePerDay) &&maxpricePerDay>0){
      getcars=getcars.filter(c=>c.pricePerDay <= maxPrixe)
    }
  }
  if(q){
    const lowerq=q.tolowerCase();
    getcars=getcars.filter(c=>c.plate && c.plate.tolowerCase().includes(lowerq))
  }
  
  const start=(page-1)*limit
  const end=start+limit
  res.json({
      page,
      limit,
      total:getcars.length,
      totalPages:Math.ceil(getcars.length/limit),
      data:getcars.slice(start,end)
  })
}

function getCarByIdController(req, res) {
  res.status(200);
  result = getCarByIdService(req.params.id);
  result !== false
    ? res.status(200).send(result)
    : res.status(404).json("Error, car Not Found !");
}

function createCarController(req, res) {
  if (createCarService(req.body) === true) {
    res.status(201).json("car Created Secussfully !");
  }
}

function updateCarController(req, res) {
  if (updateCarService(req.params.id, req.body) === true) {
    res.status(200).json("car Updated Secussfully !");
  } else {
    res.status(404).json("car  NOT FOUND !");
  }
}

function deleteCarController(req, res) {
  if (deleteCarService(req.params.id) === true) {
    res.status(200).json("car Deleted Secussfully !");
  } else {
    res.status(404).json("car  NOT FOUND !");
  }
}

module.exports = {
  getAllCarsController,
  getCarByIdController,
  createCarController,
  updateCarController,
  deleteCarController,
};
