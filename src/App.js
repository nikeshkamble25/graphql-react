import React, { Component } from 'react';
import _ from 'lodash';
import BookService from './services/book-service/book-servie';
import AuthorService from './services/book-service/author-servie';

class App extends Component {
	bookService;
	authorService;
	constructor(props) {
		super(props);
		this.state = {
			bookData: null,
			authorData: null,
			bookId: 0,
			bookTitle: '',
			bookPrice: '',
			bookAuthorId: 0,
			formState: 'Add',
		};
		this.handleChange = this.handleChange.bind(this);
		this.AddBook = this.AddBook.bind(this);
		this.EditBook = this.EditBook.bind(this);
		this.handleDropdown = this.handleDropdown.bind(this);
	}
	componentDidMount() {
		this.displayBooks();
		this.getAuthors();
	}
	getAuthors() {
		this.authorService = new AuthorService();
		return this.authorService.GetAuthors().then(({ data }) => {
			this.setState({
				authorData: data.authors.nodes,
			});
		});
	}
	displayBooks() {
		this.bookService = new BookService();
		return this.bookService.GetBooks().then(({ data }) => {
			this.setState({
				bookData: data.books.nodes,
			});
		});
	}
	renderAuthors() {
		if (this.state.bookData) {
			return _.map(this.state.authorData, ({ id, name, surname }) => {
				return <option key={id} value={id}>{name + ' ' + surname}</option>;
			});
		}
	}
	renderBooks() {
		if (this.state.bookData) {
			return _.map(this.state.bookData, ({ id, title, price, author }) => {
				return (
					<tr key={id}>
						<td>{id}</td>
						<td>{title}</td>
						<td>{price}</td>
						<td>{author ? author.name + ' ' + author.surname : 'Unknown'}</td>
						<td>
							<input
								type='button'
								value='Edit'
								style={{ width: '42%' }}
								onClick={() => {
									this.EditBook(id);
								}}
							/>
							<input
								type='button'
								value='Delete'
								style={{ width: '50%' }}
								onClick={() => {
									this.DeleteBook(id);
								}}
							/>
						</td>
					</tr>
				);
			});
		}
	}

	handleChange(event) {
		if (event.target.id === 'txtPrice') {
			this.setState({ bookPrice: event.target.value });
		}
		if (event.target.id === 'txtTitle') {
			this.setState({ bookTitle: event.target.value });
		}
		if (event.target.id === 'txtAuthor') {
			this.setState({ bookAuthorId: event.target.value });
		}
	}

	handleDropdown(event) {
		this.setState({ bookAuthorId: event.target.value });
	}

	AddBook() {
		this.bookService = new BookService();
		var promise = null;
		const bookState = this.state;
		if (this.state.formState === 'Add') {
			promise = this.bookService.AddBook(
				bookState.bookTitle,
				bookState.bookPrice,
				bookState.bookAuthorId,
				0
			);
		}
		if (this.state.formState === 'Update') {
			promise = this.bookService.UpdateBook(
				bookState.bookTitle,
				bookState.bookPrice,
				bookState.bookAuthorId,
				bookState.bookId
			);
		}
		promise.then((data) => {
			this.setState({ bookPrice: '' });
			this.setState({ bookTitle: '' });
			this.setState({ bookAuthorId: 0 });
			this.setState({ bookId: 0 });
			this.displayBooks();
		});
	}
	EditBook(id) {
		this.bookService = new BookService();
		this.bookService.GetBook(parseInt(id)).then(({ data }) => {
			const book = data.books.nodes[0];
			this.setState({ bookPrice: book.price });
			this.setState({ bookTitle: book.title });
			this.setState({ bookAuthorId: book.authorId });
			this.setState({ bookId: book.id });
			this.setState({ formState: 'Update' });
			this.displayBooks();
		});
	}
	DeleteBook(id) {
		this.bookService = new BookService();
		this.bookService.DeleteBook(parseInt(id)).then(({ data }) => {
			this.displayBooks();
		});
	}
	render() {
		return (
			<table border='1' width='100%' cellPadding='5' cellSpacing='0'>
				<thead></thead>
				<tbody>
					<tr>
						<th>Id</th>
						<th>Title</th>
						<th>Price</th>
						<th>Author</th>
						<th>Action</th>
					</tr>
					{this.renderBooks()}
					<tr>
						<td>
							<input
								type='text'
								id='txtId'
								value={this.state.bookId}
								style={{ width: '95%' }}
								disabled
							/>
						</td>
						<td>
							<input
								type='text'
								id='txtTitle'
								onChange={this.handleChange}
								value={this.state.bookTitle}
								style={{ width: '95%' }}
							/>
						</td>
						<td>
							<input
								type='text'
								id='txtPrice'
								style={{ width: '95%' }}
								value={this.state.bookPrice}
								onChange={this.handleChange}
							/>
						</td>
						<td>
							<select
								style={{ width: '95%' }}
								onChange={this.handleDropdown}
								value={this.state.bookAuthorId}
							>
								<option value='0'> Unknown</option>
								{this.renderAuthors()}
							</select>
						</td>
						<td>
							<input
								type='button'
								value={this.state.formState + ' Book'}
								style={{ width: '95%' }}
								onClick={this.AddBook}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default App;
