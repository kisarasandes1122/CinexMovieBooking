const Theatre = require('../models/theatreModel');

     //Get all theatres
     const getAllTheatres = async (req, res) => {
         try {
             const theatres = await Theatre.find();
             res.json(theatres)
         }
         catch(err) {
             res.status(500).json({message: err.message})
         }
     }

    // Create a new theatre
    const createTheatre = async (req, res) => {
         const theatre = new Theatre(req.body)
         try{
             const newTheatre = await theatre.save();
             res.status(201).json(newTheatre);
         }
         catch(err){
           res.status(400).json({message: err.message});
         }
    }

    //get a theatre by id.
     const getTheatreById = async(req, res) => {
      try{
          const theatre = await Theatre.findById(req.params.id);
           if(!theatre){
                return res.status(404).json({message: 'Cannot find theatre'})
           }
          res.json(theatre)
       }
       catch(err){
           return res.status(500).json({message: err.message})
       }
    }


     // delete a theatre
    const deleteTheatreById = async(req, res) =>{
       try{
          const theatre = await Theatre.findByIdAndDelete(req.params.id);
          if(!theatre){
                return res.status(404).json({message: 'Cannot find theatre'})
           }
         res.json({message: 'Theatre deleted'})
       }
       catch(err){
            return res.status(500).json({message: err.message})
       }
    }



  // Update a theatre
   const updateTheatreById = async (req, res) => {
         try {
        const updatedTheatre = await Theatre.findByIdAndUpdate(
           req.params.id,
           req.body,
           { new: true }
        )

       if(!updatedTheatre){
             return res.status(404).json({message: 'Cannot find theatre'})
         }

           res.json(updatedTheatre);
         }
      catch (err) {
        return res.status(500).json({message: err.message})
      }
    }

    module.exports = {
         getAllTheatres,
        createTheatre,
       getTheatreById,
       deleteTheatreById,
       updateTheatreById
    }