import { globalValues } from '../global';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

class AuthorService {
	client;
	constructor() {
		this.client = new ApolloClient({
			uri: globalValues.API_ADDRESS,
			cache: new InMemoryCache(),
		});
	}
	GetAuthors() {
		this.client = new ApolloClient({
			uri: globalValues.API_ADDRESS,
			cache: new InMemoryCache(),
		});
		return this.client.query({
			query: gql`
				
				query {
						authors(order_by: { name: ASC }) {
						nodes {
							id
							name
							surname
						}
					}
				}
			  
			`,
		});
	}
}

export default AuthorService;
