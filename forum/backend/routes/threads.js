const router = require('express').Router();
let Thread = require('../models/thread.model');


//get all threads
router.route('/').get((req, res) => {
  Thread.find({ del_flag: false })
    .then(threads => res.json(threads))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get threads by parent ID
router.route('/topic').get((req, res) => {
  console.log('parent topic: ' + req.query.id)
  Thread.find({ parent_topic_id: req.query.parent_topic_id, del_flag: false })
    .then(topic => res.json(topic))
    .catch(err => res.status(400).json('Error: ' + err));
});


//get threads by internal ID via query parameter
router.route('/queryid').get((req, res) => {
  console.log('threads/query id: ' + req.query.id)
  Thread.find({ _id: req.query._id, del_flag: false })
    .then(threads => res.json(threads))
    .catch(err => res.status(400).json('Error: ' + err));
});


//get thread by internal db ID via URL
router.route('/urlid/:id').get((req, res) => {
  console.log('threads/query ID Via URL' + req.params.id);
  Thread.findById(req.params.id)
      .then(threads => res.json(threads))
      .catch(err => res.status(400).json('Error: ' + err));
});


//add a thread
router.route('/add').post((req, res) => {
  const parent_topic_id = req.body.parent_topic_id;
  const thread_num = req.body.thread_num;
  const thread_author = req.body.thread_author;
  const thread_title = req.body.thread_title;
  const del_flag = req.body.del_flag;

  let newThread = new Thread({
    parent_topic_id,
    thread_num,
    thread_author,
    thread_title,
    del_flag
  });

  //get the highest thread_num
  Thread.find({ parent_topic_id: req.body.parent_topic_id, del_flag: false }).sort({thread_num: -1}).limit(1)
    .exec(function (error, thread) {
      console.log('thread[0]: ' + thread[0]);
      if (typeof thread[0] === 'undefined' ) {
        console.log('thread_num undefined...');
        newThread.thread_num = 0;
      } else {
        console.log('thread[0].thread_num: ' + thread[0].thread_num);
        newThread.thread_num = Number(thread[0].thread_num + 1);
      }

      newThread.save()
        .then(() => res.json('Thread added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    });
});

//update a thread
router.route('/update').post((req, res) => {
  console.log('updating thread: ' + req.body._id)
  Thread.findById( req.body._id )
    .then(threads => {
        threads.thread_title = req.body.thread_title;
        threads.del_flag = req.body.del_flag;

      threads.save()
        .then(() => res.json('Thread updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


  //del not tested yet
  router.route('/delete').post((req, res) => {
    console.log('deleting (del_flag = true) thread: ' + req.body._id)
    Thread.findById( req.body._id )
      .then(threads => {
        threads.del_flag = true;
        threads.save()
          .then(() => res.json('Thread deleted (flagged)!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });



module.exports = router;