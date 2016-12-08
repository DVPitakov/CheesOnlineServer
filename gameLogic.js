const var  MOZHNO  =   0b00000010;
const var VRAG =       0b00000100;


class ChessPositions {
    char type[64];
    char color[64];
    ChessPositions(){}
    ChessPositions(const ChessPositions& oth) {
        memcpy(this->type, oth.type, sizeof(this->type));
        memcpy(this->color, oth.color, sizeof(this->color));
    }
    ChessPositions(const char* newType64, const char* newColor64) {
        memcpy(this->type, newType64, sizeof(this->type));
        memcpy(this->color, newColor64, sizeof(this->color));
    }
    bool operator==(const ChessPositions& oth) {
        for(int i = 0; i  <64; i++) {
            if (type[i] != oth.type[i] || color[i] != oth.color[i]) {
                return false;
            }
        }
        return true;
}
};

class MyBoardLogic
{
private:
    MyVec<Step> history;
    char curColor{0};
    char hodil[64]{{0}};
    char sto[64];
    char mas[64];
    char masBuf[64];
    char stoBuf[64];
    char target{64};
    inline bool isEmpty(char _pos) {return mas[_pos] == 0;}
    inline bool isNotEmpty(char _pos) {return mas[_pos] != 0;}
    inline bool isRival(char pos1, char pos2) {return sto[pos1] != sto[pos2];}
    bool thisIsVictory();

public:

    bool podUdarom(char pos);
    void backStep();

    char kingPos(char kingColor);
    ChessPositions getPositions() {
        ChessPositions positions;
        memcpy(positions.type, mas, 64);
        memcpy(positions.color, sto, 64);
        return positions;
    }

    int pawTrans(char chosed) {
        mas[target] = chosed;
        target = 64;
        int res = thisIsVictory();
        curColor = 1 - curColor;
        return res;
    }
    int getCurColor() {
        return curColor;
    }

    MyBoardLogic();
    MyVec<char> steps(char pos);
    int moveFig(char pos1, char pos2, bool b = true);
};