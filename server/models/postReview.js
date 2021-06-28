const db = require('../database/index.js');

const postReview = (data, callback) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = data;

  let review_id;
  let characteristic_ids = Object.keys(characteristics);
  let values = Object.values(characteristics);

  var queryReview = `INSERT INTO review (id, product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (nextval('review_id_sequence'), ${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}') RETURNING id AS review_id`;

  db.query(queryReview)
  .then(res => {
    review_id = res.rows[0].review_id;
    if (photos.length) {
      photos.forEach(photo => {
        var queryPhotos = `INSERT INTO photos (id, review_id, url) VALUES (nextval('photos_id_sequence'), ${review_id}, ${photo}) RETURNING id AS photos_id`;
        db.query(queryPhotos)
        .then(res => {
          console.log(res.rows);
        })
        .catch(err => {
          console.log(err);
        })
      })
    }
  })
  .then(res => {
    characteristic_ids.forEach((char, i) => {
      var queryCharacteristics = `INSERT INTO characteristic_reviews (id, characteristic_id, review_id, value) VALUES (nextval('characteristic_reviews_id_sequence'), ${char}, ${review_id}, ${values[i]}) RETURNING id`;
      db.query(queryCharacteristics)
      .then(res => {
        callback(null, res.rows);
      })
      .catch(err => {
        callback(err);
      })
    })
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = postReview;
