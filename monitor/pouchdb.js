//@flow
/* 
 * the flow type definition of pouchDB
 *
 */

declare module "pouchdb" {

	declare class AllDocsResult {
		rows : Array<{
			id : string,
			key : string,
			doc : {[string]:any},
		}>;
	}

	//{{{ PouchDB
	declare class PouchDB { 
		static plugin(a : any) : any;
		static adapter(a : any,b:any) : any;
		static debug : any;
		static sync (a:any,b:any,c:any) : any;
		constructor(dbname : string , option? : any) : PouchDB;
		close() : any;
		destroy () : Promise<{
			ok : boolean,}>;

		allDocs (options : ?{
				include_docs? : boolean,
				limit? : boolean,
			},callback : ?Function) : Promise<AllDocsResult>;
		
		bulkDocs ( docs : Array<any> ) : Promise<Array<{
			ok : boolean,
			id : string,
			rev : string,
		}> | Array<{
			status : number,
			name : string,
			message : string,
			error : boolean,
		}>
		>;

		query(
			indexName	: string,
			option		: Object,
		) : Promise<any>;

		put ( doc : {} ) : Promise<>;

		createIndex ( 
			index : 
				{
					index : {
						fields : Array<string>
					}
				},
			callback : ?Function ) :
			Promise<{result : 'created' | 'exists'}>;
		getIndexes () : any;

		find (
			request : {
						selector : any,
						fields? : Array<string>,
						sort? : Array<{[string] : 'asc' | 'desc'}>,
					},
			callback : ?Function
		) :
			Promise<{
				docs : Array<{[string]:any}>,
			}>;

		get ( _id : string ) : Promise<{}>;

		remove ( doc : {}) : Promise<{
			ok : boolean,
			id : string,
			rev : string,
		}>;


		//plugin dump
		dump ( a : any) : any;
		load ( a : any) : any;

		replicate ( a : any) : any;
		sync (a:any,b:any) : any;

		info () : any;

		search(options : any) : Promise<{
			rows	: any
		}>;


	} //}}} PouchDB


	declare export default typeof PouchDB;
}
