var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// Mostrar la página principal de libros
router.get('/', function (req, res, next) {
    dbConn.query('SELECT * FROM books ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', 'Error al obtener los libros');
            res.render('books', { data: '' });
        } else {
            res.render('books', { data: rows });
        }
    });
});

// Mostrar formulario para agregar libro
router.get('/add', function (req, res, next) {
    res.render('books/add', {
        name: '',
        author: ''
    });
});

// Agregar nuevo libro
router.post('/add', function (req, res, next) {
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', "Por favor, ingrese el nombre y el autor.");
        res.render('books/add', {
            name: name,
            author: author
        });
    }

    if (!errors) {
        var form_data = {
            name: name,
            author: author
        };

        dbConn.query('INSERT INTO books SET ?', form_data, function (err, result) {
            if (err) {
                req.flash('error', 'Error al agregar el libro');
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.author
                });
            } else {
                req.flash('success', 'Libro agregado exitosamente');
                res.redirect('/books');
            }
        });
    }
});

// Mostrar formulario para editar libro
router.get('/edit/(:id)', function (req, res, next) {
    let id = req.params.id;

    dbConn.query('SELECT * FROM books WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err;

        if (rows.length <= 0) {
            req.flash('error', 'No se encontró el libro');
            res.redirect('/books');
        } else {
            res.render('books/edit', {
                title: 'Editar libro',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            });
        }
    });
});

// Actualizar libro
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', "Por favor, ingrese el nombre y el autor.");
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author
        });
    }

    if (!errors) {
        var form_data = {
            name: name,
            author: author
        };

        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function (err, result) {
            if (err) {
                req.flash('error', 'Error al actualizar el libro');
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                });
            } else {
                req.flash('success', 'Libro actualizado exitosamente');
                res.redirect('/books');
            }
        });
    }
});

// Eliminar libro
router.get('/delete/(:id)', function (req, res, next) {
    let id = req.params.id;

    dbConn.query('DELETE FROM books WHERE id = ' + id, function (err, result) {
        if (err) {
            req.flash('error', 'Error al eliminar el libro');
            res.redirect('/books');
        } else {
            req.flash('success', 'Libro eliminado exitosamente');
            res.redirect('/books');
        }
    });
});

module.exports = router;
