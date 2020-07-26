import { globalValues } from '../global';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

class BookService {
	client;
	constructor() {
		this.client = new ApolloClient({
			uri: globalValues.API_ADDRESS,
			cache: new InMemoryCache(),
		});
	}
	GetBooks() {
		this.client = new ApolloClient({
			uri: globalValues.API_ADDRESS,
			cache: new InMemoryCache(),
		});
		return this.client.query({
			query: gql`
				query {
					books(order_by: { id: DESC }) {
						nodes {
							id
							title
							price
							author {
								name
								surname
							}
						}
					}
				}
			`,
		});
	}
	GetBook(bookId) {
		this.client = new ApolloClient({
			uri: globalValues.API_ADDRESS,
			cache: new InMemoryCache(),
		});
		return this.client.query({
			query: gql`
				query($bookId: Int) {
					books(where: { id: $bookId }) {
						nodes {
							id
							title
							price
							authorId
							author {
								name
								surname
							}
						}
					}
				}
			`,
			variables: {
				bookId: bookId,
			},
		});
	}
	AddBook(title, price, authorId, bookId) {
		return this.client.mutate({
			mutation: gql`
				mutation addBooks($bookInputType: BookInputTypeInput) {
					addBooks(bookInputType: $bookInputType) {
						price
						title
						authorId
					}
				}
			`,
			variables: {
				bookInputType: {
					title: title,
					price: parseInt(price),
					authorId: parseInt(authorId),
					id: parseInt(bookId),
				},
			},
		});
	}

	UpdateBook(title, price, authorId, bookId) {
		debugger;
		return this.client.mutate({
			mutation: gql`
				mutation updateBooks($bookInputType: BookInputTypeInput) {
					updateBooks(bookInputType: $bookInputType) {
						price
						title
						authorId
					}
				}
			`,
			variables: {
				bookInputType: {
					title: title,
					price: parseInt(price),
					authorId: parseInt(authorId),
					id: parseInt(bookId),
				},
			},
		});
	}
	DeleteBook(bookId) {
		return this.client.mutate({
			mutation: gql`
				mutation deleteBooks($bookInputType: BookInputTypeInput) {
					deleteBooks(bookInputType: $bookInputType) 
				}
			`,
			variables: {
				bookInputType: {
					id: parseInt(bookId)
				},
			},
		});
	}
}

export default BookService;
