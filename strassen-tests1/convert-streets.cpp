// All Rights Reserved by PEPE(c)

#include <fstream>
#include <string>
#include <sstream>

using namespace std;

int main()
{
	string current("");
	ifstream f_input("inputs.txt");
	ofstream f_output;
	f_output.open("output.txt");
	if(f_input.is_open())
	{
		while(f_input.good())
		{
			getline(f_input, current);
			string substring;
			stringstream stream(current);
			while(stream.good())
			{
				getline(stream, substring, ',');
				f_output << substring << endl;
			}
		}
	}
	return 0;
	f_output.close();
	f_input.close();
}